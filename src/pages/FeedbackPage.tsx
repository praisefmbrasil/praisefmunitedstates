import React, { useState, useEffect } from 'react'
import {
  MessageSquare,
  Music,
  Settings,
  Send,
  CheckCircle2,
  ArrowLeft,
  Mic2,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

type FeedbackType = 'general' | 'music' | 'technical' | 'shoutout'

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [type, setType] = useState<FeedbackType>('general')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  useEffect(() => {
    const typeParam = searchParams.get('type')

    if (
      typeParam &&
      ['general', 'music', 'technical', 'shoutout'].includes(typeParam)
    ) {
      setType(typeParam as FeedbackType)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!formData.name.trim()) {
        throw new Error('Please enter your name or artist name.')
      }

      if (!formData.email.trim()) {
        throw new Error('Please enter your contact email.')
      }

      if (!formData.message.trim()) {
        throw new Error('Please enter a message or track link before transmitting.')
      }

      const feedbackData = {
        type,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        created_at: new Date().toISOString(),
      }

      // ATENÇÃO: por enquanto o formulário NÃO envia os dados para lugar nenhum.
      console.log('Feedback submitted locally:', feedbackData)

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      console.error('Submission Error:', err)
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    {
      id: 'general',
      label: 'Program Feedback',
      icon: Mic2,
      desc: 'Comment on our shows and presenters',
    },
    {
      id: 'music',
      label: 'Artist Submission',
      icon: Music,
      desc: 'Send your track for airplay consideration',
    },
    {
      id: 'technical',
      label: 'Technical Issue',
      icon: Settings,
      desc: 'Report bugs or streaming problems',
    },
    {
      id: 'shoutout',
      label: 'Send a Shoutout',
      icon: MessageSquare,
      desc: 'Message for someone special on air',
    },
  ] as const

  const inputClass =
    'w-full bg-black/30 border border-white/10 rounded-xl p-4 outline-none focus:border-[#ff6600] transition-colors text-white placeholder-white/30 font-medium disabled:opacity-50'

  return (
    // Sem fundo próprio: o fundo ambiente do App aparece por trás
    <div className="min-h-screen text-white">
      <div className="py-16 md:py-20 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff6600]/15 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-white/60 hover:text-white mb-10 text-[10px] font-medium uppercase tracking-[0.4em] group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Exit to Home
          </button>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            {type === 'music' ? 'Artist Submission' : 'Your Voice'}
          </h1>

          <p className="text-xl text-white/70 font-normal uppercase tracking-tight max-w-xl">
            {type === 'music'
              ? 'Join the next generation of worship. Our team reviews every track sent through our system.'
              : 'Help us shape the future of Praise FM USA. Your voice directly influences our sound.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50 mb-6">
              Select Subject
            </h3>

            {categories.map((cat) => (
              <button
                key={cat.id}
                disabled={loading || submitted}
                onClick={() => setType(cat.id as FeedbackType)}
                className={`w-full text-left p-5 border rounded-2xl backdrop-blur transition-all flex items-start space-x-5 disabled:opacity-50 ${
                  type === cat.id
                    ? 'border-[#ff6600] bg-[#ff6600]/10'
                    : 'border-white/10 bg-white/5 hover:border-white/40'
                }`}
              >
                <cat.icon
                  className={`w-6 h-6 mt-1 flex-shrink-0 ${
                    type === cat.id ? 'text-[#ff6600]' : 'text-white/50'
                  }`}
                />

                <div>
                  <h4 className="font-bold uppercase tracking-tighter text-xl text-white">
                    {cat.label}
                  </h4>

                  <p className="text-white/60 text-xs mt-1 uppercase tracking-tight">
                    {cat.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8">
            {submitted ? (
              <div className="bg-[#ff6600]/10 backdrop-blur-xl border border-[#ff6600]/60 rounded-2xl p-10 md:p-16 text-white flex flex-col items-center text-center animate-in zoom-in-95 duration-500 shadow-2xl">
                <CheckCircle2 className="w-20 h-20 mb-8 text-[#ff6600]" />

                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
                  Transmission Successful
                </h2>

                <p className="text-white/70 text-lg font-normal uppercase tracking-tight max-w-sm">
                  {type === 'music'
                    ? 'Your submission has been received. If your sound fits our current rotation, we will be in touch.'
                    : 'Your input has been received. Thank you for contributing to Praise FM USA.'}
                </p>

                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', email: '', message: '' })
                  }}
                  className="mt-10 border border-white/40 rounded-xl px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-12"
              >
                {error && (
                  <div className="bg-red-500/10 text-red-300 p-5 flex items-start space-x-4 border-l-4 border-red-500 rounded-r-xl">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Transmission Error
                      </span>

                      <p className="text-xs font-medium mt-1">{error}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50">
                      Full Name / Artist Name
                    </label>

                    <input
                      type="text"
                      required
                      disabled={loading}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={inputClass}
                      placeholder="e.g. Maverick City Music"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/50">
                      Contact Email
                    </label>

                    <input
                      type="email"
                      required
                      disabled={loading}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={inputClass}
                      placeholder="management@artist.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/50">
                    {type === 'music'
                      ? 'Track Information / SoundCloud or Drive Link'
                      : 'Your Message'}
                  </label>

                  <textarea
                    rows={6}
                    required
                    disabled={loading}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`${inputClass} resize-none`}
                    placeholder={
                      type === 'music'
                        ? 'Please provide a private link to your track and a short bio...'
                        : "Tell us what's on your mind..."
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-[#ff6600] text-white px-12 py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center space-x-4 disabled:opacity-50 active:scale-95"
                >
                  {loading ? (
                    <>
                      <span>Transmitting...</span>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>
                        {type === 'music' ? 'Submit Track' : 'Transmit Feedback'}
                      </span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackPage