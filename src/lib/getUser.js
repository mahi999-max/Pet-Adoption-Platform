import { authClient } from "@/lib/auth-client" // import the auth client

const { data: session, error } = await authClient.getSession()
export const userSession=session

const apiUrl=process.env.NEXT_PUBLIC_API_URL || "https://pet-adoption-platform-server-plum.vercel.app"

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

export const myListings = async (email) => {
    const res = await fetch(
        `${apiUrl}/myListings?ownerEmail=${encodeURIComponent(email)}`
    );
    return res.json();
};
export const updatePet = async (id, data) => {
    const res = await fetch(`${apiUrl}/myListings/${id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const deletePet = async (id) => {
    const res = await fetch(`${apiUrl}/myListings/${id}`, {
        method: "DELETE",
    });
    return res.json();
};

export const sendAdoptRequest = async (data) => {
    const res = await fetch(`${apiUrl}/adoptRequest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return res.json();
};

// শুধু petId এর তালিকা (Adopt Now বাটনের "Sent" এর জন্য)
export const myAdoptRequests = async (email) => {
    const res = await fetch(
        `${apiUrl}/myAdoptRequests?requesterEmail=${encodeURIComponent(email)}`
    );
    return res.json();
};

// পুরো রিকোয়েস্ট ডকুমেন্ট (My Requests পেজের জন্য)
export const myRequests = async (email) => {
    const res = await fetch(
        `${apiUrl}/myRequests?requesterEmail=${encodeURIComponent(email)}`
    );
    return res.json();
};

// Get incoming adoption requests
export const getIncomingRequests = async (ownerEmail, petId) => {
    const res = await fetch(
        `${apiUrl}/incomingRequests?ownerEmail=${encodeURIComponent(ownerEmail)}&petId=${petId}`
    );

    return res.json();
};


// Update adoption request status
export const updateAdoptionRequest = async (id, status, ownerEmail) => {
    const res = await fetch(`${apiUrl}/adoptRequest/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, ownerEmail })
    });

    return res.json();
};

export const getMyIncomingRequests = async (ownerEmail) => {
  const res = await fetch(
    `${apiUrl}/myIncomingRequests?ownerEmail=${encodeURIComponent(ownerEmail)}`
  );

  if (!res.ok) {
    throw new Error("Failed to load incoming requests");
  }

  return res.json();
};