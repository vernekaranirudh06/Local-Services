// Here the logic of status is beeen tracked...


//VIMP this object will tell us ki what transition status are available
// And who will be the User and what all permission will it owns....

const transitions={
    "Requested" :{
        "provider":['Confirmed','Cancelled'],//Provider can confirm or reject for this status
        "customer":['Cancelled'],
    },
    "Confirmed" :{
        "provider":['In-Progress','Cancelled'],//Provider can confirm or reject for this status
        "customer":['Cancelled'],
    },
    "In-Progress" :{
        "provider":['Completed'],//Provider can confirm or reject for this status
        "customer":[],
    },
    "Completed" :{
        "provider":[],//Provider can confirm or reject for this status
        "customer":[],
    },
    "Cancelled":{
        "provider":[],
        "customer":[],
    },
}




// This function will check if the transition state is valid or noooo


const  isValidTransition= (currentStatus,newStatus,role)=>{

    //Step 1 -> get all the details the current role can have 
    const allowed=transitions[currentStatus]?.[role] ?? [];

    if(!transitions[currentStatus]){
        return {allowed:false ,message:`Unknown status : ${currentStatus}`}
    }
    if(!allowed.includes(newStatus)){
        return {
        allowed: false,
        message: `"${role}" cannot move booking from "${currentStatus}" to "${newStatus}"`,
    }
    }

    return {allowed:true,message:"Valid Transition"}

}

export {isValidTransition};