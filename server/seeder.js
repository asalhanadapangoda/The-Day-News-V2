import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import AdminUser from './models/AdminUser.js';
import Program from './models/Program.js';
import Episode from './models/Episode.js';
import ArticleCategory from './models/ArticleCategory.js';
import Article from './models/Article.js';
import Advertisement from './models/Advertisement.js';
import SiteSetting from './models/SiteSetting.js';
import ContactMessage from './models/ContactMessage.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await AdminUser.deleteMany();
    await Program.deleteMany();
    await Episode.deleteMany();
    await ArticleCategory.deleteMany();
    await Article.deleteMany();
    await Advertisement.deleteMany();
    await SiteSetting.deleteMany();
    await ContactMessage.deleteMany();

    console.log('Database cleared!');

    // Create Admin
    const createdAdmin = await AdminUser.create({
      name: 'Admin User',
      email: 'admin@thedaynews.com',
      password: 'password123',
    });
    console.log('Admin user created (admin@thedaynews.com / password123)');

    // Create Settings
    await SiteSetting.create({
      siteName: 'The Day News Global',
      footerText: '© 2026 The Day News Global. Trusted journalism, 24/7.',
      contactEmail: 'contact@thedaynews.com',
      aboutUsText: '<p>The Day News Global is your premier source for truth and analysis...</p>'
    });

    // Create Ads
    await Advertisement.create([
      { title: 'Test Ad 1', imageUrl: 'https://placehold.co/728x90/2E004F/FFF?text=Leaderboard+Ad', placement: 'home_top' },
      { title: 'Test Ad 2', imageUrl: 'https://placehold.co/300x250/6A1BB9/FFF?text=Square+Ad', placement: 'sidebar' }
    ]);

    // Create Article Categories
    const categories = await ArticleCategory.create([
      { name: 'World Politics', slug: 'world-politics', description: 'Global political news.' },
      { name: 'Business & Tech', slug: 'business-tech', description: 'Business and technology insights.' }
    ]);

    // Create Articles
    await Article.create([
      {
        title: 'Global Summit Reaches New Climate Agreement',
        slug: 'global-summit-climate-agreement-2026',
        excerpt: 'World leaders have finally agreed on a new emissions plan for the next decade.',
        content: '<p>After weeks of careful deliberation, an agreement has been reached...</p>',
        featuredImage: 'https://placehold.co/800x450/333/FFF?text=Climate+Summit',
        category: categories[0]._id,
        status: 'published'
      },
      {
        title: 'AI Revolutionizes the Tech Industry Again',
        slug: 'ai-revolution-tech-industry-2026',
        excerpt: 'New breakthroughs in artificial intelligence promise to shift the landscape.',
        content: '<p>Tech giants have announced a new wave of generative models...</p>',
        featuredImage: 'https://placehold.co/800x450/444/FFF?text=AI+Revolution',
        category: categories[1]._id,
        status: 'published'
      }
    ]);

    // Create Programs
    const programs = await Program.create([
      {
        title: 'The Daily Brief',
        slug: 'the-daily-brief',
        description: 'Your morning rush of global news.',
        coverImage: 'https://placehold.co/600x400/2E004F/FFF?text=The+Daily+Brief',
        isFeatured: true
      },
      {
        title: 'Tech Talk Live',
        slug: 'tech-talk-live',
        description: 'Deep dives into the tech world.',
        coverImage: 'https://placehold.co/600x400/6A1BB9/FFF?text=Tech+Talk+Live'
      }
    ]);

    // Create Episodes
    await Episode.create([
      {
        title: 'Morning Update: European Markets',
        slug: 'morning-update-european-markets',
        description: 'A quick look at how the markets opened today.',
        program: programs[0]._id,
        thumbnailImage: 'https://placehold.co/400x225/111/FFF?text=Morning+Update',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '15:20',
        status: 'published'
      },
      {
        title: 'Understanding Quantum Computing',
        slug: 'understanding-quantum-computing',
        description: 'We demystify quantum processing chips.',
        program: programs[1]._id,
        thumbnailImage: 'https://placehold.co/400x225/222/FFF?text=Quantum+Computing',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '45:10',
        status: 'published'
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // We can add a destroy data function here if needed
} else {
  importData();
}
