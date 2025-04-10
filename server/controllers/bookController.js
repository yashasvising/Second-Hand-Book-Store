import Book from '../models/Book.js';

export const createBook = async (req, res, next) => {
  try {
    req.body.seller = req.user._id;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);
    console.log('Filtered Query:', parsedQuery);

    let queryObj = {};

    if (req.query.search && req.query.search.trim() !== '') {
      queryObj = {
        ...parsedQuery,
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { author: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    } else {
      queryObj = parsedQuery;
    }

    let query = Book.find(queryObj).populate('seller', 'name email');

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    query = query.skip(startIndex).limit(limit);

    const books = await query;

    const total = await Book.countDocuments(queryObj);

    const pagination = {};
    const endIndex = page * limit;

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: books.length,
      pagination,
      total,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: books
    });
  } catch (error) {
    console.error('Error in getBooks:', error);
    next(error);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('seller', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book'
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book'
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

export const getSellerBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ seller: req.user._id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};