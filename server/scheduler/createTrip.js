import TravelRequest from "../models/travelRequest";
import cron from 'node-cron';


const TRIP_API = 'http://localhost:8001/trip/'
const trip_endpoint = 'trips/create/multi'

const APPROVAL_API = 'http://localhost:8001/approval'
const approval_endpoint = ''

//basic status UpdateBatchJob function...
async function batchJob(){

    try {   

            const results = await TravelRequest.find({
                travelRequestStatus : 'booked',
                sentToTrip : false,
                isCashAdvanceTaken: false,
            });


            //send results to trip 
            //const res_trip  = await axios.post(`${TRIP_API}/${trip_endpoint}`, {trips:results})
            //if(res_trip.status!=200) throw new Error('Unable to send data to trip-ms')

            //update  sentToTrip flag to true 
            const updateResults = await TravelRequest.updateMany({
                travelRequestStatus : 'booked',
                sentToTrip : false,
                isCashAdvanceTaken: false,
            }, 
            {$set : {sentToTrip:true}});
                       
        } catch (e) {
        console.error('error in statusUpdateBatchJob', e);
      }    
}

// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running batch job...');
    batchJob();
  });
  
  // Function to trigger the batch job on demand
  const triggerBatchJob = () => {
    console.log('Triggering batch job on demand...');
    batchJob();
  };
  
  export { triggerBatchJob };