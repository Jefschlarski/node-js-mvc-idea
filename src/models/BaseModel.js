const { Model, where } = require("sequelize");


/** 
 * @class BaseModel
 * 
 * This class is used as a base class for all other models in the application.
 * 
 * @extends {Model} The Sequelize Model class.
 * @author [Jeferson Schlarski](https://github.com/Jefschlarski) 
 */
class BaseModel extends Model {

    static paginationItensLimit = 10
    
    /**
     * This method returns an object with a condition to be used in where clauses, based on the search string.
     * @returns {Object} An object with a condition to be used in where clauses.
     */
    static getSearchCondition() {
        return {}
    }

    /**
     * This method takes an array of models and returns an object with two properties, labels and data, which are used to create a chart.
     * The labels are the dates when the models were created, and the data is the number of models created on each date.
     * @param {Model[]} models The models to get the chart data for.
     * @returns {Promise<{labels: string[], data: number[]}>} A promise that resolves with an object having two properties: labels and data.
     * The labels property is an array of strings representing the dates of the models, and the data property is an array of numbers representing the count of models per date.
     */
    static async getChartCreationData(models) {
        const modelsByDate = {};

        models.forEach((model) => {
            const date = new Date(model.createdAt).toLocaleDateString('pt-BR');
    
            if (modelsByDate[date]) {
                modelsByDate[date]++;
            } else {
                modelsByDate[date] = 1;
            }
        });
        
        const labels = Object.keys(modelsByDate); 
        const data = Object.values(modelsByDate);

        return { labels, data };
    }

    /**
     * This method takes a page number, a search string and an array of models to include in the query and returns an object with four properties: list, totalPages, currentPage and limit.
     * The list property is an array of models, totalPages is the number of pages that the query will have, currentPage is the page that was requested and limit is the number of items per page.
     * The list is ordered by the createdAt date in ascending order.
     * The search string is used to filter the results, and the includeModels is an array of models to include in the query.
     * @param {number} currentPage The page number to get
     * @param {string} search The search string to filter the results
     * @param {Model[]} includeModels The models to include in the query
     * @returns {Promise<{list: Model[], totalPages: number, currentPage: number, limit: number}>} A promise that resolves with an object having four properties: list, totalPages, currentPage and limit.
     */
    static async getListWithPagination(currentPage, search, includeModels) {
        const limit = this.paginationItensLimit;
        const offset = (currentPage - 1) * limit;

        const listModel = await this.findAll({
            include: includeModels,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'ASC']],
            where: this.getSearchCondition(search),
        });

        const list = listModel.map((model) => model.get({ plain: true }))

        const totalItens = await this.count({
            where: this.getSearchCondition(search)
        });

        const totalPages = Math.ceil(totalItens / limit);

        return { list, totalPages, currentPage, limit };
    }
}

module.exports = BaseModel