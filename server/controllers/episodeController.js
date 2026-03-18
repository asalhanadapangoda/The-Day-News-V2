import Episode from '../models/Episode.js';
import Program from '../models/Program.js';

// @desc    Fetch all episodes, optionally filtered by program Id
// @route   GET /api/episodes
// @access  Public
const getEpisodes = async (req, res) => {
  try {
    const { program } = req.query;
    let query = {};
    if (program) {
      query.program = program;
    }

    // Populate program name
    const episodes = await Episode.find(query)
      .populate('program', 'title slug')
      .sort({ publishDate: -1 });
    res.json(episodes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch single episode by ID or Slug
// @route   GET /api/episodes/:idOrSlug
// @access  Public
const getEpisodeByIdOrSlug = async (req, res) => {
  try {
    const isObjectId = req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.idOrSlug } : { slug: req.params.idOrSlug };
    
    const episode = await Episode.findOne(query).populate('program', 'title slug coverImage');

    if (episode) {
      res.json(episode);
    } else {
      res.status(404).json({ message: 'Episode not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an episode
// @route   POST /api/episodes
// @access  Private (Admin)
const createEpisode = async (req, res) => {
  try {
    const { title, slug, description, program, thumbnailImage, videoUrl, status, publishDate } = req.body;

    const programExists = await Program.findById(program);
    if (!programExists) {
      return res.status(404).json({ message: 'Program not found. Please select a valid program.' });
    }

    // Auto-generate slug from title if not provided
    const generateSlug = (str) =>
      str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

    let finalSlug = slug ? slug.trim() : generateSlug(title);

    // Ensure unique slug
    let slugExists = await Episode.findOne({ slug: finalSlug });
    let counter = 1;
    while (slugExists) {
      finalSlug = `${generateSlug(slug || title)}-${counter}`;
      slugExists = await Episode.findOne({ slug: finalSlug });
      counter++;
    }

    const episode = new Episode({
      title,
      slug: finalSlug,
      description,
      program,
      thumbnailImage,
      videoUrl,
      status,
      publishDate,
    });

    const createdEpisode = await episode.save();
    res.status(201).json(createdEpisode);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an episode
// @route   PUT /api/episodes/:id
// @access  Private (Admin)
const updateEpisode = async (req, res) => {
  try {
    const { title, slug, description, program, thumbnailImage, videoUrl, status, publishDate } = req.body;

    const episode = await Episode.findById(req.params.id);

    if (episode) {
      episode.title = title || episode.title;
      episode.slug = slug || episode.slug;
      episode.description = description !== undefined ? description : episode.description;
      episode.program = program || episode.program;
      episode.thumbnailImage = thumbnailImage || episode.thumbnailImage;
      episode.videoUrl = videoUrl || episode.videoUrl;
      episode.status = status || episode.status;
      episode.publishDate = publishDate || episode.publishDate;

      const updatedEpisode = await episode.save();
      res.json(updatedEpisode);
    } else {
      res.status(404).json({ message: 'Episode not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an episode
// @route   DELETE /api/episodes/:id
// @access  Private (Admin)
const deleteEpisode = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);

    if (episode) {
      await episode.deleteOne();
      res.json({ message: 'Episode removed' });
    } else {
      res.status(404).json({ message: 'Episode not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getEpisodes, getEpisodeByIdOrSlug, createEpisode, updateEpisode, deleteEpisode };
