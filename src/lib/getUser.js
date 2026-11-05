import { authClient } from "@/lib/auth-client" // import the auth client

const { data: session, error } = await authClient.getSession()
export const userSession=session

const apiUrl=process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const getAllPets=async()=>{
    const res=await fetch(`${apiUrl}/allPets`)
    return res.json()
}

export const petDetails=async({id})=>{
    const res=await fetch(`${apiUrl}/allPets/${id}`)
    return res.json()
}

export const AddPet=async(data)=>{
    const res=await fetch(`${apiUrl}/addPet`,{
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify(data)
    })
    return res.json()
    
}