import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { streamAIResponse } from '../services/ai.service';
import ChatHistory from '../models/ChatHistory';
import Profile from '../models/Profile';
import { buildAIContext, cacheError } from '../algorithms/contextBuilder';
import { assembleSystemPrompt, assembleHintPrompt } from '../algorithms/promptAssembler';
import { computeFrustrationScore, buildFrustrationSignals } from '../algorithms/frustrationDetector';
import { trackEvent } from '../algorithms/analytics';
import { analyzeError } from '../algorithms/errorAnalyzer';

export const chat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, sessionId, projectId, currentCode, currentMission, currentStage, lastError } = req.body;
    const childId = req.user?.profileId;

    if (!childId || !message || !sessionId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const profile = await Profile.findById(childId);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    // Save user message
    await ChatHistory.create({
      childId,
      sessionId,
      role: 'user',
      content: message,
    });

    // Track analytics
    await trackEvent(childId, 'buddy_message_sent', { sessionId, messageLength: message.length }, sessionId);

    // If there's an error, cache it for context
    if (lastError) {
      const parsed = analyzeError(lastError, currentCode || '');
      cacheError(childId, parsed);
    }

    // Build full AI context using Intelligence Layer
    let systemPrompt: string;
    try {
      const ctx = await buildAIContext(childId, projectId || '', sessionId);
      systemPrompt = assembleSystemPrompt(ctx);
    } catch {
      // Fallback to basic prompt if context building fails
      const { buildSystemPrompt } = await import('../services/ai.service');
      systemPrompt = buildSystemPrompt(
        profile.displayName,
        currentCode || '',
        currentMission || 'Free coding',
        currentStage || '',
        profile.skillLevel,
        0,
        lastError || ''
      );
    }

    // Get recent history for conversation
    const history = await ChatHistory.find({ childId, sessionId })
      .sort({ createdAt: -1 })
      .limit(10);

    const messages = history
      .reverse()
      .map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content }));

    // Compute frustration for buddy emotion
    const recentMsgs = history.filter(m => m.role === 'user').slice(-5);
    const signals = buildFrustrationSignals(
      recentMsgs.map(m => m.content),
      0,
      0,
      0
    );
    const frustrationScore = computeFrustrationScore(signals);

    // Stream response
    const fullResponse = await streamAIResponse(res, messages, systemPrompt);

    // Save assistant response with buddy emotion
    if (fullResponse) {
      const buddyEmotion = frustrationScore > 60 ? 'concerned' :
                          frustrationScore > 30 ? 'thinking' : 'happy';

      await ChatHistory.create({
        childId,
        sessionId,
        role: 'assistant',
        content: fullResponse,
        buddyEmotion,
      });

      await trackEvent(childId, 'buddy_message_received', {
        sessionId,
        responseLength: fullResponse.length,
        buddyEmotion,
        frustrationScore,
      }, sessionId);
    }

    // Update last active date
    await Profile.findByIdAndUpdate(childId, { lastActiveDate: new Date() });
  } catch (error) {
    console.error('AI chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI chat failed' });
    }
  }
};

export const getHint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId, projectId, currentCode, currentMission, currentStage, hintLayer, lastError } = req.body;
    const childId = req.user?.profileId;

    if (!childId || !sessionId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const profile = await Profile.findById(childId);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    const layer = hintLayer || 1;

    // Track hint analytics
    await trackEvent(childId, layer === 1 ? 'hint_requested' : 'hint_layer_advanced', {
      sessionId,
      hintLayer: layer,
      currentStage,
    }, sessionId);

    // Build hint request message
    let hintMessage = '';
    if (layer === 1) {
      hintMessage = `The student is asking for a hint (Layer 1 — Nudge). Give them a small nudge pointing in the right direction. No code at all. Ask a guiding question about their current stage: "${currentStage}"`;
    } else if (layer === 2) {
      hintMessage = `The student needs more help (Layer 2 — Scaffold). Give a small code snippet or pseudocode — NOT the full answer. Help them see the structure for stage: "${currentStage}"`;
    } else {
      hintMessage = `The student is stuck (Layer 3 — Reveal). Show the full solution with a line-by-line explanation for stage: "${currentStage}". Be encouraging.`;
    }

    await ChatHistory.create({
      childId,
      sessionId,
      role: 'user',
      content: hintMessage,
    });

    // Build AI context with Intelligence Layer
    let systemPrompt: string;
    try {
      const ctx = await buildAIContext(childId, projectId || '', sessionId);
      systemPrompt = assembleHintPrompt(ctx, layer);
    } catch {
      const { buildSystemPrompt } = await import('../services/ai.service');
      systemPrompt = buildSystemPrompt(
        profile.displayName,
        currentCode || '',
        currentMission || '',
        currentStage || '',
        profile.skillLevel,
        layer,
        lastError || ''
      );
    }

    const history = await ChatHistory.find({ childId, sessionId })
      .sort({ createdAt: -1 })
      .limit(10);

    const messages = history
      .reverse()
      .map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content }));

    const fullResponse = await streamAIResponse(res, messages, systemPrompt);

    if (fullResponse) {
      await ChatHistory.create({
        childId,
        sessionId,
        role: 'assistant',
        content: fullResponse,
        buddyEmotion: 'thinking',
      });
    }
  } catch (error) {
    console.error('AI hint error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Hint request failed' });
    }
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    const { sessionId } = req.params;

    const messages = await ChatHistory.find({ childId, sessionId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(messages.reverse());
  } catch {
    res.status(500).json({ error: 'Failed to get chat history' });
  }
};

export const clearChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    const { sessionId } = req.params;

    await ChatHistory.deleteMany({ childId, sessionId });
    res.json({ message: 'Chat history cleared' });
  } catch {
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};
