import { useMemo, useState } from "react"
import { ApiResponse, RatingDTO } from "../types/ApiInterfaces"
import { getRatingsByProduct, getRatingsByUser } from "../api/ratingApi";
import { toast } from "react-toastify";
/**
 * @param userId The unique identifier of the user.
 * @param token The decoded token.
 */
interface UseRatingApiInterface {
    userId: number,
    token: string,
}

const useRatingApi = ({userId, token}:  UseRatingApiInterface) => {
    const [ratings, setRatings] = useState<RatingDTO[] | null>(null);

    /**
     * Fetches the ratings for a user and adds them to existing ratings.
     */
    const fetchAndSetRatingByUser = async () => {
        const response: ApiResponse<RatingDTO[]> = await getRatingsByUser(userId);
        if(response.data){
            const newRatings: RatingDTO[] = response.data;
            if(ratings)
                setRatings([...ratings, ...newRatings])
            else
                setRatings([...newRatings]);
        } else {
            toast.error('Error fetching ratings.');
        }
    }   

    /**
     * Fetches the ratings for a product and adds them to existing ratings.
     */
    const fetchAndSetRatingByProduct = async () => {
        const response: ApiResponse<RatingDTO[]> = await getRatingsByProduct(userId);
        if(response.data){
            const newRatings: RatingDTO[] = response.data;
            if(ratings)
                setRatings([...ratings, ...newRatings])
            else
                setRatings([...newRatings]);
        } else {
            toast.error('Error fetching ratings.');
        }
    }  

    const userRatings: RatingDTO[] = useMemo(() => {
        if(!ratings)
            return [];
        const userRatings = ratings.filter(
            item => item.userId === userId
        );

        return userRatings;
    }, [ratings]);

}