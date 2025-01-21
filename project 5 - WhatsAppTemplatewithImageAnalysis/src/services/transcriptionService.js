import OpenAI from 'openai';

export class TranscriptionService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateMotivationalMessage(category) {
    const prompt = this.getCategoryPrompt(category);
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a motivational coach specializing in providing inspiring and actionable advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150
    });

    return completion.choices[0].message.content;
  }

  getCategoryPrompt(category) {
    const prompts = {
      'personal-growth': 'Generate an inspiring message about personal development and self-improvement.',
      'mindfulness': 'Create a calming message about staying present and mindful.',
      'success': 'Provide motivation for achieving goals and success.',
      'resilience': 'Share wisdom about overcoming challenges and building resilience.',
      'gratitude': 'Compose a message about appreciation and gratitude.',
      'daily-wisdom': 'Share an insightful quote or wisdom for daily inspiration.'
    };

    return prompts[category] || prompts['daily-wisdom'];
  }
}