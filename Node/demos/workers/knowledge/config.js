module.exports = function () {
    //process.env variables defined in Azure if deployed to a web app. For testing, place IDs and Keys inline
    global.searchName = process.env.AZURE_SEARCH_NAME ? process.env.AZURE_SEARCH_NAME : "first-search";
    global.indexName = process.env.INDEX_NAME ? process.env.INDEX_NAME : "index-one";
    global.searchKey = process.env.AZURE_SEARCH_KEY ? process.env.AZURE_SEARCH_KEY : "B0AB5C93351777DF971D386F9A96ADFF";
    
    global. queryString = 'https://' + searchName + '.search.windows.net/indexes/' + indexName + '/docs?api-key=' + searchKey + '&api-version=2015-02-28&&';
}