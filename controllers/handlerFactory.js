import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import APIFeatures from '../utils/apiFeatures.js';
import NotFoundError from '../errors/notFound.js';

const getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;
    // const docs = await features.query.explain();

    res.status(StatusCodes.OK).json({
      status: 'success',
      nbHits: docs.length,
      requestedAt: req.requestTime,
      docs,
    });
  });

const getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const doc = await Model.findById(docId);

    if (!doc) {
      return next(
        new NotFoundError(`No document found with that ID → ${docId}`)
      );
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      doc,
    });
  });

const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create({ ...req.body });

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      doc,
    });
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const doc = await Model.findById(docId);

    if (!doc) {
      return next(
        new NotFoundError(`No document found with that ID → ${docId}`)
      );
    }

    const updateddoc = await Model.findByIdAndUpdate(
      docId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      doc: updateddoc,
    });
  });

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const doc = await Model.findById(docId);

    if (!doc) {
      return next(new NotFoundError(`No doc found with that ID → ${docId}`));
    }

    await doc.remove();

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      doc: null,
    });
  });

const factory = {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};

export default factory;
