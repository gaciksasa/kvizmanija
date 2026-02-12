import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import { type Question, CATEGORIES } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const VALID_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'sve');

type SortKey = 'text' | 'category' | 'difficulty';
type SortDir = 'asc' | 'desc';

const DIFFICULTY_ORDER: Record<string, number> = { easy: 0, medium: 1, hard: 2 };

export const Admin: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>('text');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterText, setFilterText] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    text: '',
    options: ['', '', '', ''],
    correct_answer: '',
    description: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.email !== 'info@gacikdesign.com') {
      navigate('/');
      return;
    }

    fetchQuestions();
  }, [user, navigate]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setQuestions(data as Question[]);
      }
    } catch (error) {
      console.error('Greška pri učitavanju pitanja:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingId) {
        const { error } = await supabase
          .from('questions')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);
        if (error) {
          console.error('Update error:', error);
          alert('Greška pri ažuriranju: ' + error.message);
          return;
        }
      } else {
        const { error } = await supabase.from('questions').insert({
          ...formData,
          created_by: user?.id,
        });
        if (error) {
          console.error('Insert error:', error);
          alert('Greška pri dodavanju: ' + error.message);
          return;
        }
      }

      fetchQuestions();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        category: '',
        difficulty: 'medium',
        text: '',
        options: ['', '', '', ''],
        correct_answer: '',
        description: '',
      });
    } catch (error) {
      console.error('Greška pri čuvanju pitanja:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Sigurno obrisiš ovo pitanje?')) return;

    try {
      await supabase.from('questions').delete().eq('id', id);
      fetchQuestions();
    } catch (error) {
      console.error('Greška pri brisanju pitanja:', error);
    }
  };

  const handleEdit = (question: Question) => {
    setFormData({
      category: question.category,
      difficulty: question.difficulty,
      text: question.text,
      options: question.options,
      correct_answer: question.correct_answer,
      description: question.description,
    });
    setEditingId(question.id);
    setShowForm(true);
  };

  const filteredQuestions = questions
    .filter((q) => {
      if (filterCategory && q.category !== filterCategory) return false;
      if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
      if (filterText && !q.text.toLowerCase().includes(filterText.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'difficulty') {
        cmp = DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
      } else {
        cmp = a[sortKey].localeCompare(b[sortKey], 'sr');
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">⚙️ Admin Panel</h1>
          <Button
            variant="primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                category: '',
                difficulty: 'medium',
                text: '',
                options: ['', '', '', ''],
                correct_answer: '',
                description: '',
              });
            }}
          >
            {showForm ? 'Zatvori formu' : '➕ Novo pitanje'}
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => { setShowForm(false); setEditingId(null); }}>
            <div className="card w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Izmeni pitanje' : 'Novo pitanje'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Kategorija
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="input"
                      required
                    >
                      <option value="">Odaberi kategoriju</option>
                      {VALID_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Težina
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                        })
                      }
                      className="input"
                    >
                      <option value="easy">⭐ Lako</option>
                      <option value="medium">⭐⭐ Srednje</option>
                      <option value="hard">⭐⭐⭐ Teško</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Pitanje"
                  placeholder="Tekst pitanja..."
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  required
                />

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Opcije odgovora
                  </label>
                  {formData.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Opcija ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      className="input mb-2"
                      required
                    />
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tačan odgovor
                  </label>
                  <select
                    value={formData.correct_answer}
                    onChange={(e) =>
                      setFormData({ ...formData, correct_answer: e.target.value })
                    }
                    className="input mb-4"
                    required
                  >
                    <option value="">Odaberi tačan odgovor</option>
                    {formData.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <Button variant="primary" type="submit" isLoading={loading}>
                    {editingId ? 'Ažuriraj pitanje' : 'Dodaj pitanje'}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Otkaži
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">
            📚 Pitanja ({filteredQuestions.length}/{questions.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
            >
              <option value="">Sve kategorije</option>
              {VALID_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
              ))}
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="input"
            >
              <option value="">Sve težine</option>
              <option value="easy">⭐ Lako</option>
              <option value="medium">⭐⭐ Srednje</option>
              <option value="hard">⭐⭐⭐ Teško</option>
            </select>

            <input
              type="text"
              placeholder="Pretraži pitanja..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="input"
            />
          </div>

          {loading ? (
            <p className="text-gray-400">⏳ Učitavam...</p>
          ) : filteredQuestions.length === 0 ? (
            <p className="text-gray-400">Nema pitanja.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-primary select-none"
                      onClick={() => handleSort('text')}
                    >
                      Pitanje{sortIcon('text')}
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-primary select-none whitespace-nowrap"
                      onClick={() => handleSort('category')}
                    >
                      Kategorija{sortIcon('category')}
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-primary select-none whitespace-nowrap"
                      onClick={() => handleSort('difficulty')}
                    >
                      Težina{sortIcon('difficulty')}
                    </th>
                    <th className="py-3 px-3 whitespace-nowrap">Tačan odgovor</th>
                    <th className="py-3 px-3">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((question) => (
                    <tr key={question.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                      <td className="py-3 px-3">{question.text}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{question.category}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {question.difficulty === 'easy'
                          ? '⭐ Lako'
                          : question.difficulty === 'medium'
                          ? '⭐⭐ Srednje'
                          : '⭐⭐⭐ Teško'}
                      </td>
                      <td className="py-3 px-3 text-green-400">{question.correct_answer}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(question)}
                          >
                            Izmeni
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(question.id)}
                          >
                            Obriši
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
