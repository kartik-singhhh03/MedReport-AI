# MedReport AI 🧠🩺
( project under development)

AI-powered medical report analyzer with disease prediction and smart recommendations. Transform complex medical data into actionable health insights.

## ✨ Features

### 🤖 Advanced AI Processing
- **OCR Text Extraction**: Extract text from PDFs and images using Tesseract.js
- **NLP Analysis**: Process medical text with BERT models via Hugging Face
- **Disease Prediction**: ML-powered health risk assessment
- **Smart Recommendations**: Personalized health suggestions

### 🌐 Multi-Language Support
- **English & Hindi**: Complete UI and analysis in both languages
- **Accessibility**: WCAG compliant with accessibility mode
- **Responsive Design**: Works on all devices

### 🔒 Security & Privacy
- **End-to-End Encryption**: Secure file handling
- **HIPAA Compliance**: Medical data protection
- **Row Level Security**: Database-level access control
- **Rate Limiting**: API protection

### 📊 Interactive Dashboard
- **Health Score**: AI-calculated overall health rating
- **Risk Assessment**: Cardiovascular and diabetes risk analysis
- **Timeline View**: Track health progress over time
- **Export Options**: PDF reports and data export

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for state management
- **React Router** for navigation

### Backend & AI
- **Supabase** for database and auth
- **Tesseract.js** for OCR
- **Hugging Face** for NLP
- **OpenAI GPT-4** for analysis
- **Edge Functions** for serverless processing

### Development
- **Vite** for build tooling
- **ESLint** for code quality
- **TypeScript** for type safety
- **Zod** for validation

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/medreport-ai.git
cd medreport-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Fill in your environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `VITE_HUGGINGFACE_API_KEY`: Hugging Face API key
- `VITE_OPENAI_API_KEY`: OpenAI API key

4. **Set up Supabase**
- Create a new Supabase project
- Run the migrations in `supabase/migrations/`
- Set up storage bucket for medical reports
- Configure RLS policies

5. **Start development server**
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout components
│   ├── reports/        # Report-related components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## 🔧 Configuration

### Database Schema
The application uses Supabase with the following main tables:
- `reports`: Medical report storage and metadata
- `user_preferences`: User settings and preferences
- `analytics`: Usage analytics and tracking
- `audit_logs`: Security and compliance logging

### AI Services
- **OCR**: Tesseract.js for text extraction
- **NLP**: Hugging Face Bio_ClinicalBERT model
- **Analysis**: OpenAI GPT-4 for comprehensive analysis
- **Predictions**: Custom ML models for disease prediction

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- Database credentials
- API keys
- Analytics tokens
- Error monitoring (Sentry)

## 🔒 Security Features

- **File Validation**: Strict file type and size validation
- **Input Sanitization**: XSS protection
- **Rate Limiting**: API abuse prevention
- **CSRF Protection**: Cross-site request forgery protection
- **Secure Headers**: Security headers implementation

## 📊 Monitoring & Analytics

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Privacy-compliant usage tracking
- **Health Checks**: System status monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📱 PWA Features

- **Offline Support**: Service worker implementation
- **App Installation**: Add to home screen
- **Push Notifications**: Health reminders
- **Background Sync**: Offline data synchronization

## 🌍 Internationalization

- **Multi-language**: English and Hindi support
- **RTL Support**: Right-to-left text support
- **Locale-aware**: Date, number, and currency formatting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.medreport-ai.com](https://docs.medreport-ai.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/medreport-ai/issues)
- **Email**: support@medreport-ai.com

## ⚠️ Medical Disclaimer

This application is for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

Made with ❤️ by the MedReport AI Team
