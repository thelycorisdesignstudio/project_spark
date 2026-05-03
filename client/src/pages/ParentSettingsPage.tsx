import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import ParentNav from '../components/layout/ParentNav';
import api from '../services/api';

interface ChildProfile {
  _id: string;
  displayName: string;
  avatarColor: string;
  age: number;
  dailyTimeLimitMinutes?: number;
  publicSharingEnabled?: boolean;
}

export default function ParentSettingsPage() {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    api.get('/profile/children')
      .then(({ data }) => setChildren(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (child: ChildProfile) => {
    setEditingId(child._id);
    setEditForm({
      displayName: child.displayName,
      age: child.age,
      dailyTimeLimitMinutes: child.dailyTimeLimitMinutes || 60,
      publicSharingEnabled: child.publicSharingEnabled ?? true,
      pin: '',
    });
    setSaveMsg('');
  };

  const handleSave = async (childId: string) => {
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        displayName: editForm.displayName,
        age: editForm.age,
        dailyTimeLimitMinutes: editForm.dailyTimeLimitMinutes,
        publicSharingEnabled: editForm.publicSharingEnabled,
      };
      if (editForm.pin && editForm.pin.length === 4) {
        payload.pin = editForm.pin;
      }
      const { data } = await api.put(`/profile/child/${childId}`, payload);
      setChildren((prev) => prev.map((c) => (c._id === childId ? { ...c, ...data } : c)));
      setEditingId(null);
      setSaveMsg('Settings saved!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      console.error('Failed to save:', err);
      setSaveMsg('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-void)', minHeight: '100vh' }}>
      <ParentNav />
      <PageTransition>
        <div className="max-w-3xl mx-auto px-6 py-24">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Settings
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Manage your children's profiles and controls
          </p>

          {saveMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                backgroundColor: saveMsg.includes('failed') ? 'rgba(220, 38, 38, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                color: saveMsg.includes('failed') ? 'var(--neon-coral)' : 'var(--neon-green)',
                border: `1px solid ${saveMsg.includes('failed') ? 'rgba(220, 38, 38, 0.2)' : 'rgba(5, 150, 105, 0.2)'}`,
              }}
            >
              {saveMsg}
            </motion.div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 rounded-2xl skeleton" style={{ backgroundColor: 'var(--bg-surface)' }} />
              ))}
            </div>
          ) : children.length === 0 ? (
            <div className="p-12 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No child profiles found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {children.map((child) => (
                <motion.div
                  key={child._id}
                  className="p-6 rounded-2xl"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {editingId === child._id ? (
                    /* Edit Mode */
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                          style={{ backgroundColor: child.avatarColor, color: '#ffffff' }}
                        >
                          {child.displayName.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                          Edit {child.displayName}
                        </h3>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={editForm.displayName}
                          onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                        />
                      </div>

                      {/* Age */}
                      <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                          Age
                        </label>
                        <input
                          type="number"
                          min={4}
                          max={18}
                          value={editForm.age}
                          onChange={(e) => setEditForm({ ...editForm, age: Number(e.target.value) })}
                          className="w-24 px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                        />
                      </div>

                      {/* Daily Time Limit */}
                      <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                          Daily Time Limit (minutes)
                        </label>
                        <input
                          type="number"
                          min={10}
                          max={480}
                          step={5}
                          value={editForm.dailyTimeLimitMinutes}
                          onChange={(e) => setEditForm({ ...editForm, dailyTimeLimitMinutes: Number(e.target.value) })}
                          className="w-24 px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                        />
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          Set to 0 for unlimited
                        </p>
                      </div>

                      {/* Public Sharing */}
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                          Allow public project sharing
                        </label>
                        <button
                          onClick={() => setEditForm({ ...editForm, publicSharingEnabled: !editForm.publicSharingEnabled })}
                          className="w-10 h-6 rounded-full relative cursor-pointer transition-colors"
                          style={{
                            backgroundColor: editForm.publicSharingEnabled ? 'var(--neon-cyan)' : 'var(--bg-surface-3)',
                          }}
                        >
                          <span
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                            style={{
                              left: editForm.publicSharingEnabled ? '18px' : '2px',
                            }}
                          />
                        </button>
                      </div>

                      {/* PIN Change */}
                      <div>
                        <label className="text-xs font-medium block mb-1" style={{ color: 'var(--text-secondary)' }}>
                          New PIN (leave blank to keep current)
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          pattern="[0-9]*"
                          inputMode="numeric"
                          value={editForm.pin}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setEditForm({ ...editForm, pin: val });
                          }}
                          placeholder="••••"
                          className="w-24 px-3 py-2 rounded-lg text-sm outline-none text-center tracking-widest"
                          style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
                        />
                      </div>

                      {/* Save / Cancel */}
                      <div className="flex items-center gap-3 pt-2">
                        <motion.button
                          onClick={() => handleSave(child._id)}
                          className="px-4 py-2 rounded-xl text-sm font-bold cursor-pointer"
                          style={{ backgroundColor: 'var(--neon-cyan)', color: '#ffffff' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                        <motion.button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
                          style={{ color: 'var(--text-muted)' }}
                          whileHover={{ scale: 1.05 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                          style={{ backgroundColor: child.avatarColor, color: '#ffffff' }}
                        >
                          {child.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                            {child.displayName}
                          </h3>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Age {child.age} | Time limit: {child.dailyTimeLimitMinutes || 'Unlimited'} min/day
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => startEdit(child)}
                        className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
                        style={{
                          backgroundColor: 'var(--bg-surface-2)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Edit
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </div>
  );
}
