import HRMaster from "../../models/hrMaster.js";


export default async function updateHRMaster(payload){
    try{
        const tenantId = payload.tenantId
        const result = await HRMaster.updateOne({tenantId}, {...payload}, {upsert: true})
        console.log(payload)
        console.log(result)
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
    }
}