import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || ""; //  informs the TypeScript compiler about the expected type
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {}; // there is no point to create a type for query object because the type will be complicated and there are too many options that we could pass to create it query we don't really know what the type is going to be

    // check if any restaurants available in the given city for this request and if not then return early and skip the rest of the logic
    query["city"] = new RegExp(city, "i"); //property being added to the query object // we're defining an option in our query that says go and get me all the restaurants where the city field matches this regex and this regex ignores
    const cityCheck = await Restaurant.countDocuments(query); // count documents will return the no. according the restaurants db have
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      // URL = selectedCuisines = italian, burgers, indian
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisinesArray }; // i m going to find all the restaurants where the cuisinesArray has all the items that we have received in the request // its going to compare all the documents that has a cuisinesArray and if that item does have all the items then its going to return that document
    } // this query will pass through Restaurant model and filters out documents

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    } // in search we can type the restaurant name or cuisine so or is and indication for that and in is for any item matches inside array(cuisines array)

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 }) // sort according to the key // for e.g. deliveryTime
      .skip(skip)
      .limit(pageSize)
      .lean(); // remove all of the mongoose IDs and the metadata that comes back from a query like this and returns as  plain old js object

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize), // for e.g. 50 results >>>> pagesize = 10 >>>> pages = 5
      },
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    
    res.json(restaurant) // it automatically adds a status of 200 with .json
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

export default { searchRestaurant, getRestaurant };
