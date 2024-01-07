const Product = require('../db/models')



const getAllProductsStatic = async (req,res)=>{
  // throw new Error("testing async errors")
  // const search = "albany"
  // const products = await Product.find({
  //   name:{$regex:search,$options:"i"}
  // })
  const products = await Product.find({price:{$gt:30}}).select('name price').sort("price").limit(10).skip(1)
//{price:{$lt30}}
  res.status(200).json({products,length:products.length})

}
const getAllProducts = async (req,res)=>{
  // const products = await Product.find({featured:true})
  // const products2= await Product.find(req.query)
 
  const {featured,company,name,sort,fields,numericFilters} = req.query
  const queryObject = {}

  if (featured){
    queryObject.featured = featured === 'true' ? true : false
  }
  if (company) {
    const companyExists = await Product.exists({ company });
  
    if (companyExists) {
      queryObject.company = company;
    } else {
      console.log(`Компания '${company}' не существует в базе данных.`);
    }
  }
  if (name){
    queryObject.name = {$regex:search,$options:"i"}
  }
 if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  console.log(queryObject);
  let result = Product.find(queryObject);
  if (sort){
    const sortList = sort.split(',').join(' ')
    result =result.sort(sortList)
    console.log(sortList);

  }
  else{
    result = result.sort('createAt')
  }
  if (fields){
    const fieldList = fields.split(',').join(' ')
    result = result.select(fieldList)
  }
  
const page = Number(req.query.page)||1
const limit = Number(req.query.limit)||10
const skip = (page -1)*limit
//бизде 23 запись бар и дальше
// мне надо 3page и лимит 10
//  и получается (3-1)*10=20
//получается я должен пропустить 20записей и останется 3записи которые мне нужны 
result = result.skip(skip).limit(limit)
  const products = await result
  res.status(200).json({ products, length: products.length });
  }
  
module.exports = {
  getAllProducts,
  getAllProductsStatic
}
