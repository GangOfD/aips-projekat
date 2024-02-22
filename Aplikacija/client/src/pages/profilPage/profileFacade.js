
const deleteProfile = async (username, values) => {
    try {
      const deleteProfileResponse = await fetch(
        `http://localhost:3002/player/${username}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
  
      if (!deleteProfileResponse.ok) {
        throw new Error('Mistake during delete fetching');
      }
  
      const deletedProfile = await deleteProfileResponse.json();
  
      return deletedProfile;
    } catch (error) {
      console.error('Mistake during delete:', error);
      throw error;
    }
  };
  
  const updateProfile = async (username, values) => {
    try {
      const updateProfileResponse = await fetch(
        `http://localhost:3002/player/${username}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
  
      if (!updateProfileResponse.ok) {
        throw new Error('Mistake during update fetching');
      }
  
      const updatedProfile = await updateProfileResponse.json();
  
      return updatedProfile;
    } catch (error) {
      console.error('Mistake during update fetching:', error);
      throw error;
    }
  };

  const register = async (values, onSubmitProps) => {
    
    try{
        const savedUserResponse = await fetch(
            "http://localhost:3002/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
          if (!savedUserResponse.ok) {
            throw new Error('Mistake during reg fetching');
          }
        
          const savedUser = await savedUserResponse.json();
          console.log(savedUser);
          onSubmitProps.resetForm();
      
          return savedUser;
    }
    catch(error){
        console.error('Mistake during registration:', error);
    }
    
  };
  
  export { deleteProfile, updateProfile, register };
  