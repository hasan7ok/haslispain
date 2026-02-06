import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const WELCOME_MESSAGES = [
  '¡Hola! أنا مساعدك لتعلم الإسبانية. اكتب أي جملة بالإسبانية وسأساعدك في تصحيحها، أو اسألني عن أي شيء! 🇪🇸',
];

const TRANSLATIONS: Record<string, string> = {
  'مرحبا': '¡Hola! 👋',
  'شكرا': '¡Gracias! 🙏',
  'كيف حالك': '¿Cómo estás? 😊',
  'صباح الخير': '¡Buenos días! ☀️',
  'مساء الخير': '¡Buenas tardes! 🌅',
  'تصبح على خير': '¡Buenas noches! 🌙',
  'أحبك': '¡Te quiero! ❤️',
  'وداعا': '¡Adiós! 👋',
  'نعم': '¡Sí! ✓',
  'لا': '¡No! ✗',
  'من فضلك': 'Por favor 🙏',
  'عفوا': 'De nada 😊',
  'ماء': 'Agua 💧',
  'طعام': 'Comida 🍽️',
  'بيت': 'Casa 🏠',
};

const GRAMMAR_TIPS: Record<string, string> = {
  'ser estar': '🧠 **Ser vs Estar:**\n\n**SER** = هوية دائمة:\n- Soy español (أنا إسباني)\n- Es doctora (هي طبيبة)\n\n**ESTAR** = حالة مؤقتة:\n- Estoy cansado (أنا متعب)\n- Está en casa (هو في البيت)\n\n💡 تذكر: SER = ما أنت، ESTAR = كيف/أين أنت!',
  'por para': '🧠 **Por vs Para:**\n\n**POR** = بسبب، خلال، عبر:\n- Gracias por tu ayuda (شكراً لمساعدتك)\n- Viajo por España (أسافر عبر إسبانيا)\n\n**PARA** = لأجل، بهدف:\n- Estudio para aprender (أدرس للتعلم)\n- Es para ti (هذا لك)',
  'masculino femenino': '🧠 **المذكر والمؤنث:**\n\n**-o = مذكر عادةً:** el libro, el gato\n**-a = مؤنث عادةً:** la casa, la mesa\n\n⚠️ **استثناءات شهيرة:**\n- el día (اليوم) - مذكر رغم النهاية!\n- la mano (اليد) - مؤنث رغم النهاية!\n- el problema - مذكر!',
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase().trim();

  // Arabic translation requests
  if (lower.includes('ترجم') || lower.includes('كيف أقول') || lower.includes('ما معنى')) {
    for (const [ar, es] of Object.entries(TRANSLATIONS)) {
      if (lower.includes(ar)) {
        return `الترجمة: ${es}\n\nمثال في جملة: يمكنك استخدامها في المحادثة اليومية! 📝`;
      }
    }
    return 'يمكنني مساعدتك في الترجمة! أخبرني بالكلمة أو العبارة التي تريد ترجمتها. 🔍';
  }

  // Grammar questions
  for (const [key, tip] of Object.entries(GRAMMAR_TIPS)) {
    if (key.split(' ').some(k => lower.includes(k))) {
      return tip;
    }
  }
  if (lower.includes('قاعدة') || lower.includes('قواعد') || lower.includes('grammar')) {
    return '📚 ما القاعدة التي تريد تعلمها؟ يمكنني شرح:\n\n1. Ser vs Estar\n2. Por vs Para\n3. المذكر والمؤنث\n4. تصريف الأفعال\n\nاكتب الموضوع الذي تريده!';
  }

  // Spanish input - try to provide feedback
  if (/[áéíóúñ¿¡]/.test(message) || /^(yo|tú|él|ella|nosotros|hola|buenos|buenas|me|te|se)\b/i.test(message)) {
    const corrections: string[] = [];

    if (/\byo soy\b/i.test(message)) {
      corrections.push('✅ استخدام ممتاز لـ "Yo soy"! هذا صحيح عند التعريف بنفسك.');
    }
    if (/\byo estoy\b/i.test(message)) {
      corrections.push('✅ رائع! "Yo estoy" تُستخدم للتعبير عن حالة مؤقتة.');
    }
    if (/\bme gusta\b/i.test(message)) {
      corrections.push('✅ "Me gusta" ممتاز! تذكر: me gusta + مفرد، me gustan + جمع.');
    }

    if (corrections.length > 0) {
      return `تحليل جملتك:\n\n${corrections.join('\n\n')}\n\n¡Muy bien! استمر في التمرين! 💪`;
    }

    return `📝 جملة جيدة! إليك بعض النصائح:\n\n- تأكد من تصريف الفعل مع الفاعل\n- لا تنسَ علامات الاستفهام المقلوبة ¿...?\n- علامات التعجب المقلوبة ¡...!\n\n¡Sigue practicando! 🌟`;
  }

  // Greetings
  if (lower.includes('هلا') || lower.includes('مرحبا') || lower.includes('هاي') || lower.includes('سلام')) {
    return '¡Hola! 👋 مرحبًا بك! كيف يمكنني مساعدتك اليوم؟\n\nيمكنني:\n🔹 ترجمة كلمات وعبارات\n🔹 شرح قواعد اللغة\n🔹 تصحيح جملك بالإسبانية\n🔹 إعطاء نصائح ثقافية';
  }

  // Default response
  return '¡Buena pregunta! 🤔\n\nيمكنك:\n📝 كتابة جملة بالإسبانية لأصححها\n🔍 طلب ترجمة (مثل: ترجم مرحبا)\n📚 السؤال عن قاعدة (مثل: ser estar)\n\n¡Vamos a aprender! 🚀';
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: WELCOME_MESSAGES[0], sender: 'ai', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiResponse = getAIResponse(input.trim());
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 500 + Math.random() * 500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-pixel">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div
              className={`max-w-[85%] p-3 font-body text-sm whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'pixel-border-accent bg-accent/10 text-foreground'
                  : 'pixel-border-muted bg-card text-foreground'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="font-pixel text-[0.5rem] text-primary mb-1">🤖 PIXÑOL AI</div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t-2 border-border bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="اكتب بالإسبانية أو اسأل سؤالاً..."
            className="flex-1 px-4 py-2 bg-muted border-2 border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            dir="auto"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="pixel-btn disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
