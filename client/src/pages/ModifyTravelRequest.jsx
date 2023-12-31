import { useState, useEffect, createContext } from "react";
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import axios from 'axios'
import BasicDetails from "./basicDetails/basicDetails";
import Itinerary from "./itinerary/Itinerary"
import Review from "./review/Review"
import Error from "../components/common/Error";
import { TR_frontendTransformer } from "../utils/transformers";

const dummyItinerary = [{
  from:null,
  to:null,
  departure: {
    from: null,
    to: null,
    date: null,
    time: null,
    bkd_from: null,
    bkd_to: null,
    bkd_date: null,
    bkd_time: null,
    modified: false,
    isCancelled: false,
    cancellationDate: null,
    cancellationReason: null,
    status:'draft',
    bookingDetails:{
      docURL: null,
      docType: null,
      billDetails: {}, 
    }
  }, 
  return:{
    from: null,
    to: null,
    date: null,
    time: null,
    bkd_from: null,
    bkd_to: null,
    bkd_date: null,
    bkd_time: null,
    modified: false,
    isCancelled: false,
    cancellationDate: null,
    cancellationReason: null,
    status:'draft',
    bookingDetails:{
      docURL: null,
      docType: null,
      billDetails: {}, 
    }
    },
  hotels:[
    {
      location:null,
      class:null, 
      checkIn:null, 
      checkOut:null,
      violations:{
        class: null,
        amount: null,
      }, 
      bkd_location:null,
      bkd_class:null,
      bkd_checkIn:null,
      bkd_checkOut:null,
      bkd_violations:{
        class: null,
        amount: null,
      },
      modified:false, 
      isCancelled:false, 
      cancellationDate:null,
      cancellationReason:null, 
      status:'draft',
      bookingDetails:{
        docURL: null,
        docType: null,
        billDetails: {}, 
      }
    }
  ],
  cabs:[
    {
      date:null, 
      class:null, 
      preferredTime:null, 
      pickupAddress:null, 
      dropAddress:null, 
      violations:{
        class: null,
        amount: null,
      }, 
      bkd_date:null,
      bkd_class:null,
      bkd_preferredTime:null,
      bkd_pickupAddress:null,
      bkd_dropAddress:null,
  
      modified:false, 
      isCancelled:false, 
      cancellationDate:null, 
      cancellationReason:null, 
      status:'draft',
      bookingDetails:{
        docURL: null,
        docType: null,
        billDetails: {}, 
      },
      type:null
    }
  ],
  modeOfTransit:null,
  travelClass:null,
  needsVisa:false,
  transfers:{
    needsDeparturePickup:false,
    needsDepartureDrop:false,
    needsReturnPickup:false,
    needsReturnDrop:false,
  },
  needsHotel:false,
  needsCab:false,
  modified:false, 
  isCancelled:false, 
  cancellationDate:null, 
  cancellationReason:null,
  status:'draft',
}]

export default function () {
  //get travel request Id from params
    const {travelRequestId} = useParams()
    console.log(travelRequestId, 'travelRequestId')
    const [isLoading, setIsLoading] = useState(true)
    const [loadingErrMsg, setLoadingErrMsg] = useState(null)

    //fetch travel request data from backend
    useEffect(()=>{
        axios
        .get(`${TRAVEL_API}/travel-requests/${travelRequestId}`)
        .then((response) => {
            console.log(response.data)
            const travelRequestDetails = TR_frontendTransformer(response.data)
            console.log(travelRequestDetails)
           //set form data...

           const currentFomData = {
              travelRequestId: travelRequestDetails.travelRequestId,
              approvers: travelRequestDetails.approvers,
              tenantId: travelRequestDetails.tenantId,
              tenantName:travelRequestDetails.tenantName,
              companyName:travelRequestDetails.companyName,
              status: travelRequestDetails.status,
              state: travelRequestDetails.state,
              createdBy: travelRequestDetails.createdBy,
              createdFor: travelRequestDetails.createdFor,
              travelAllocationHeaders:travelRequestDetails.travelAllocationHeaders,
              tripPurpose:travelRequestDetails.tripPurpose,

              raisingForDelegator: travelRequestDetails.createdFor === null ? false : true,
              nameOfDelegator: travelRequestDetails?.createdFor?.name || null,
              isDelegatorManager: false,
              selectDelegatorTeamMembers:false,
              delegatorsTeamMembers:[],

              bookingForSelf:true,
              bookiingForTeam:false,
              teamMembers : travelRequestDetails.teamMembers,
              travelDocuments: travelRequestDetails.travelDocuments,
              itinerary: travelRequestDetails.itinerary,
              tripType: travelRequestDetails.tripType,
              preferences:travelRequestDetails.preferences,
              travelViolations:travelRequestDetails.travelViolations,
              cancellationDate:travelRequestDetails.cancellationDate,
              cancellationReason:travelRequestDetails.cancellationReason,
              isCancelled:travelRequestDetails.isCancelled,
              travelRequestStatus:travelRequestDetails.travelRequestStatus,
           }


                  axios
            .get(`${TRAVEL_API}/initial-data/${tenantId}/${EMPLOYEE_ID}`)
            .then((response) => {
              console.log(response.data)
              setOnBoardingData(response.data)
              setIsLoading(false)
            })
            .catch(err=>{ 
              console.error(err)
              setLoadingErrMsg(err.response.message)
              //handle possible scenarios
            })

           setFormData(currentFomData)
           

        })
        .catch(err=>{ 
            console.error(err)
            setLoadingErrMsg(err.response.message)
            //handle possible scenarios
        })
    },[])

  const TRAVEL_API = import.meta.env.VITE_TRAVEL_API_URL 
  //hardcoded for now we will get it from dashboard/token
  const tenantId = 'tynod76eu' 
  const EMPLOYEE_ID  = '1001' 
  const EMPLOYEE_NAME = 'Abhishek Kumar'


  const [formData, setFormData] = useState()


  const [onBoardingData, setOnBoardingData] = useState()

  //flags

  return <>
        {isLoading && <Error message={loadingErrMsg} />}
      {!isLoading && <Routes>
        <Route path='/' element={<BasicDetails 
                                    formData={formData} 
                                    setFormData={setFormData} 
                                    onBoardingData={onBoardingData}
                                    nextPage={`/modify/${travelRequestId}/section1`} />} />
        <Route path='/section0' element={<BasicDetails 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/modify/${travelRequestId}/section1`} />} />
        <Route path='/section1' element={<Itinerary 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/modify/${travelRequestId}/section2`}
                                            lastPage={`/modify/${travelRequestId}/section0`} />} />
        <Route path='/section2' element={<Review 
                                            formData={formData} 
                                            setFormData={setFormData} 
                                            onBoardingData={onBoardingData}
                                            nextPage={`/modify/${travelRequestId}/section2`}
                                            lastPage={`/modify/${travelRequestId}/section1`} />} />
      </Routes>}
  </>;
}
