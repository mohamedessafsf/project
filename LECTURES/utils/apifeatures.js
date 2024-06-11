const { default: mongoose } = require("mongoose");

class ApiFeatures {
    constructor (mongooseQuery, queryStr) {
        this.mongooseQuery = mongooseQuery;
        this.queryStr = queryStr;
    };

    // Filter
    filter() {


        const queryStringObj = {...this.queryStr};
        const excludesFields = ['limit', 'page', 'sort', 'fields'];
        excludesFields.forEach((field) => delete queryStringObj[field]);
        let queryToStr = JSON.stringify(queryStringObj);
        queryToStr = queryToStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryToObject = JSON.parse(queryToStr);
        this.mongooseQuery = this.mongooseQuery.find(queryToObject);
        return this;
    };

    // Sort
    sort() {
        if(this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        };
        return this;
    };

    // Fields limiting

    fieldsLimiting() {

        if(this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        };
        return this;
    };

    // Search
    search(modelName) {
        if(this.queryStr.keyword) {
            const query = {};
            if(modelName === 'Products') {
                query.$or = [
                    {title: {$regex: this.queryStr.keyword, $options: 'i'}},
                    {description: {$regex: this.queryStr.keyword, $options: 'i'}}
                ];
                console.log(this.queryStr);
            }else {
                query.$or = [{name: {$regex: this.queryStr.keyword, $options: 'i'}}];
            };
            this.mongooseQuery = this.mongooseQuery.find(query);
        };
        return this;
    };

    // Pagination
    paginate(countDocuments) {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endPageIndex = page * limit;

        // Pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);
        
        if(endPageIndex < countDocuments) {
            pagination.nextPage = page + 1;
        };

        if(skip > 0) {
            pagination.prev = page - 1;
        };

        this.paginationResult = pagination;

        this.mongooseQuery
        .skip(skip)
        .limit(limit);
        return this;
    };    






};

module.exports = ApiFeatures;