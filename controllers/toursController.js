import Tour from "../models/tourModel.js";

export const getAllTours = async (req, res) => {
  try {
    const queryObject = { ...req.query };

    // Filtering

    const exludedQueryStrings = ["page", "limit", "sort", "fields"];

    exludedQueryStrings.forEach(
      (queryString) => delete queryObject[queryString]
    );

    // Advanced Filtering
    //mongoose query - {difficulty:'easy', duration:{$gte: 5}};
    //postman query - { difficulty: 'easy', duration: { gte: '5' } }
    let queryString = JSON.stringify(queryObject);

    queryString = JSON.parse(
      queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );

    const query = Tour.find(queryString);

    const tours = await query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours: tours },
    });
  } catch (error) {
    res.status(400).json({
      status: "fali",
      data: {
        message: error,
      },
    });
  }
};
export const getSingleTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      data: {
        message: error,
      },
    });
  }
};
export const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create({
      name: req.body.name,
      price: req.body.price,
      rating: req.body.rating,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      data: {
        message: error,
      },
    });
  }
};
export const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      data: {
        message: error,
      },
    });
  }
};
export const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      data: {
        tour: `Tour with ${req.params.id} was deleted`,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      data: {
        message: error,
      },
    });
  }
};
//middlewares
export const checkTour = async (req, res, next, value) => {
  try {
    const tour = await Tour.findById(value);
    if (!tour) {
      return res.status(404).json({
        status: "fail",
        data: {
          message: "invalid id",
        },
      });
    }
  } catch (error) {
    console.log(error);
  }

  next();
};
