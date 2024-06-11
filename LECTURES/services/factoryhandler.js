const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apifeatures');

//----------------------------------------------------------------

exports.deleteOne = (Model) => asyncHandler(async (req, res, next) => {

    const {id} = req.params;
    const document = await Model.deleteOne({_id: id});

    if(!document) {
        return next( new ApiError(`No document found for this id`), 404);
    };
    res.status(200).json({msg: 'Document deleted successfully'});
});

//----------------------------------------------------------------

exports.updateOne = (Model) => 
    asyncHandler( async (req, res, next) => {

        const updateDocument = await Model.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!updateDocument) {
            return next(new ApiError(`No document for this id: ${req.originalUrl}`, 404));
        };

        updateDocument.save();

        res.status(200).json({Result: updateDocument});
    });

//----------------------------------------------------------------



exports.getOne = (Model, populationOpt) => asyncHandler(async(req, res, next) => {

    let filter = {};
    if(req.filterOnj) {
        filter = req.filterObj
    };


    let query = Model.findById(req.params.id);
    if(populationOpt) {
        query = query.populate(populationOpt);
    };
    const document = await query;
    if(!document) {
        return next( new ApiError (`No document found for this id: ${req.originalUrl}`, 404));
    };
    res.status(200).json({Data: document});
});

//----------------------------------------------------------------

exports.createOne = (Model) => asyncHandler( async (req, res, next) => {

    const document = await Model.create(req.body);
    res.status(201).json({Data: document});
})


//----------------------------------------------------------------
exports.getAll = (Model) => asyncHandler(async(req, res, next) => {


    let filter = {};
    if(req.filterObj) {
        filter = req.filterObj
    };

    const documentsCount = await Model.countDocuments();
    let apiFeatures = await new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .fieldsLimiting()
    .sort()
    .paginate(documentsCount);


    if(req.query.keyword) {
        apiFeatures = new ApiFeatures(Model.find(filter), req.query).search();
    };
    console.log(req);
    const {mongooseQuery, paginationResult} = apiFeatures;
    const documents = await mongooseQuery;
    res.status(200).json({Result: documents.length, paginationResult, Data: documents});

});
