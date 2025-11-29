import { setAllJobs, setAvailableLocations, setAvailableJobTypes } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true});
                if(res.data.success){
                    const jobs = res.data.jobs || [];
                    dispatch(setAllJobs(jobs));

                    // compute unique locations and job types
                    const locationsSet = new Set();
                    const jobTypesSet = new Set();
                    jobs.forEach(j => {
                        if(j.location) locationsSet.add(j.location);
                        if(j.jobType) jobTypesSet.add(j.jobType);
                    });
                    dispatch(setAvailableLocations(Array.from(locationsSet)));
                    dispatch(setAvailableJobTypes(Array.from(jobTypesSet)));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    },[searchedQuery])
}

export default useGetAllJobs