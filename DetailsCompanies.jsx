import React, { useEffect,useState } from 'react'
import Nav from '../components/Nav'
import Elm from '../assets/elm.png'
import { Link, useParams } from 'react-router-dom'
import { auth, db, storage } from '../config/firebase';
import { getDoc, doc, collection, getDocs, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useLocation } from 'react-router-dom';


const DetailsCompanies = () => {
       // const {id} = useParams()
       const [applicationInfo, setApplicationInfo] = useState(null);

       const locationValue = useLocation()
       const {companyID, eventIDs} = locationValue.state
       const initialButtonState = { text: 'تقديم', color: '#99D2CB' };
       const getLocal = JSON.parse(localStorage.getItem("loggedIn"));
       const [company, setCompanyData] = useState({
           companyName: '',
           description: '',
           email: '',
           Location: '',
           logo:'',
           jobPositions: [],
           EmpList:[]
       });
       useEffect(()=>{
   
           getCompanyInfo()
           
   
       }, [])
   
   
       const getCompanyInfo = async()=>{
           
   
   
           const mainCompanyInfo = doc(db, "CompaniesData", companyID);
           console.log("##########################"+ companyID)
           const companyDocSnapshot = await getDoc(mainCompanyInfo);
   
           if (companyDocSnapshot.exists()) {
               console.log("##########################")
               
               const myCompaniesRef = doc(db, `EventDetails/${eventIDs}/myCompanies/${companyID}`);
               const userDocSnapshot = await getDoc(myCompaniesRef);
               if (userDocSnapshot.exists()) {
                   const eventJobs = userDocSnapshot.data()
                   console.log("hello in the check ")
                   const companyData = companyDocSnapshot.data();
                   console.log("helloqqqq" + companyData.companyName)
                   setCompanyData({
                       companyName: companyData.companyName,
                       description: companyData.description,
                       email: companyData.email,
                       Location: companyData.Location,  
                       logo: companyData.logo,
                       jobPositions: eventJobs.jobPositions,
                      
                   });
   
               }
               
              
            
           }
          
          
        
       }
   
      
   
       const jobApplied = async (jobName, index) => {
           try {
               const myCompaniesRef = doc(db, `users/${getLocal.id}/myEvents/${eventIDs}/appliedCompanies`, companyID);
               const userDocSnapshot = await getDoc(myCompaniesRef);
       
               if (userDocSnapshot.exists()) {
   
               const applicationInfo = userDocSnapshot.data();
   
               const positionExists = applicationInfo.allPositions.some(position => position.positionName === jobName);
   
               if (!positionExists) {
                   const updatedPositions = [
                       ...applicationInfo.allPositions,
                       { company: companyID, positionName: jobName, status: "انتظار" }
                   ];
   
                   await updateDoc(myCompaniesRef, {
                       allPositions: updatedPositions
                   });
   ;
               } else {
                   console.error(`Position '${jobName}' already exists.`);
               }
                   
                  
               } else {
                   const parentRef = doc(db, `users/${getLocal.id}/myEvents/${eventIDs}`);
                   const parentDocSnapshot = await getDoc(parentRef);
       
                   if (parentDocSnapshot.exists()) {
                       const appliedCompaniesRef = collection(db, `users/${getLocal.id}/myEvents/${eventIDs}/appliedCompanies`);
                       const docRef = doc(appliedCompaniesRef, companyID);
       
                       await setDoc(docRef, {
                           allPositions: [
                               { company: companyID, positionName: jobName, status: "انتظار" },
                           ]
                       });
                   } else {
                       console.error(`Parent document 'users/${getLocal.id}/myEvents/${eventIDs}' does not exist.`);
                   }
               }
           } catch (error) {
               console.error("Error fetching or updating document:", error);
               // Handle error appropriately
           }
       }
   
   
       const checkBtn = async()=>{
           try {
               const myCompaniesRef = doc(db, `users/${getLocal.id}/myEvents/${eventIDs}/appliedCompanies`, companyID);
               const userDocSnapshot = await getDoc(myCompaniesRef);
   
               if (userDocSnapshot.exists()) {
                   const data = userDocSnapshot.data();
                   setApplicationInfo(data);
               } else {
                   console.error("Document does not exist.");
               }
           } catch (error) {
               console.error("Error fetching document:", error);
               // Handle error appropriately
           
       }
       }
  return (
    <>
<Nav />
<div className='h-full w-full bg-[#f7f7f7] ' dir='rtl '>
   {/* <div className='flex mt-10 flex-col'> */}
    <div className='flex max-sm:flex-wrap w-full gap-5 p-10 ml-6 bg-[#f7f7f7] max-sm:w-full'>
         <img className='w-[30vw] h-[60vh] rounded-lg object-cover max-sm:w-[82vw] max-sm:h-[45vh] mr-3' src={company.logo} />
         <div className=' flex flex-col w-[58vw] bg-white rounded-lg h-[60vh] mr-4 p-3 max-sm:w-[82vw] max-sm:h-[45vh] max-sm:mr-0 '>
            <p className='pt-6 pr-4 font-extrabold text-[#5C59C2] text-[1.5rem]'> {company.companyName}</p>
            <div className='flex gap-2 mt-4 pt-2 pr-5 '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-[#99D2CB]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <p className='text-[gray] text-[0.9rem] '> {company.Location} </p>
            </div>
            <div className='mt-2'>
                <p className='pr-6 pt-2 text-[#202020] text-[0.9rem]'><span className='font-bold '>التفاصيل:</span> {company.description}</p>
            </div>
            <div className='flex mt-7 gap-2 justify-end items-end pb-1 h-[30vh] mb-2'>
                {/* <div className="flex justify-end items-center mt-4 ml-2">
                    <p className="w-[8vw] text-[#ffffff] font-bold text-[0.9rem] bg-[#99D2CB] hover:bg-[#a5ddd7] py-2 px-4 rounded-lg cursor-pointer text-center max-sm:text-[0.8rem] max-sm:w-[20vw] ">تقديم</p>
                </div> */}
                    <Link to={`/Companies/${eventIDs}`}><p className="w-[8vw] text-[#ffffff] font-bold text-[0.9rem] bg-[#7c7c7c] hover:bg-[#919191] py-2 px-4  rounded-lg cursor-pointer text-center max-sm:w-[20vw] max-sm:mb-5">العودة</p>
                    </Link>
            </div>
        </div>      
    </div>

<div className='flex justify-center bg-[#f7f7f7] w-[93%] mr-10   max-sm:mr-0 max-sm:w-full max-sm:mb-2'>
  <div role="tablist" className="tabs w-[90vw] tabs-lifted bg-white rounded-lg">

    {/* الشواغر */}
    <input type="radio" name="my_tabs_2" role="tab" className="tab bg-white hover:text-[#5C59C2] " aria-label="الشواغر" defaultChecked/>
    <div role="tabpanel" className="tab-content  bg-white border-base-100 rounded-box p-6 h-[20vw] overflow-y-auto custom-scrollbar max-sm:h-[28vh]">
      <p className='text-lg mb-5 font-extrabold text-[#5C59C2]' > قائمة الشواغر</p>
        <table className="w-full h-[20vh] max-sm:table-xs">
            <tbody>
              <tr className="focus:outline-none h-16 border border-[#e4e6e6] bg-[#fafafa] rounded">
                <th className="text-center p-3 px-5 max-sm:p-1 ">المسمى الوظيفي</th>
                {/* <th className="text-right p-3 px-5">المسؤوليات </th>
                <th className="text-right p-3 px-5">المهارات المطلوبة</th> */}
                <th className="text-center p-3 px-5 max-sm:p-1">التقديم </th>
            </tr>
            {company.jobPositions && company.jobPositions.length > 0 && (
    <>
        {company.jobPositions.map((job, index) => (
            <tr key={index} className="focus:outline-none h-16 border border-[#e4e6e6] rounded">
                <td className="p-3 px-5 max-sm:p-1 text-center">
                    <div className="flex flex-wrap justify-center overflow-y-auto h-6 custom-scrollbar max-sm:h-12">
                        <p className="text-base font-medium max-sm:text-xs leading-none text-gray-700 w-[10ch] break-words max-sm:w-[10ch]"> {job}</p>
                    </div>
                </td>
                <td className="p-3 px-5 max-sm:p-1 text-center ">
                    <div className="flex flex-wrap justify-center items-center ">
                        <p className="text-base text-center font-medium max-sm:text-xs leading-none text-gray-700 w-[15ch] break-words max-sm:w-[10ch]">
                            <div className='flex justify-center gap-2'>
                                <span onClick={()=> jobApplied(job,index)} className="text-base px-4 bg-[#7ed191] py-1  rounded-md text-white font-medium leading-none  mr-2 max-sm:w-10 max-sm:text-[0.7rem] max-sm:px-0.5 max-sm:font-bold">تقديم</span>
                            </div>
                        </p>
                    </div>
                </td>
            </tr>
        ))}
    </>
)}


     
        
            </tbody>
        </table>  
</div>
{/* تقديماتي */}
    <input type="radio" name="my_tabs_2" role="tab" className="tab bg-white hover:text-[#5C59C2]" aria-label="تقديماتي"  />
    <div role="tabpanel" className="tab-content bg-white border-base-100 rounded-box p-6 h-[20vw] overflow-y-auto custom-scrollbar max-sm:h-[28vh]">
    <p className='text-lg mb-5 font-extrabold text-[#5C59C2]' > قائمة تقديماتي</p>
    <table className="w-full h-[20vh] max-sm:table-xs">
        <tbody>
            <tr className="focus:outline-none h-16 border border-[#e4e6e6] bg-[#fafafa] rounded">
              <th className="text-center p-3 px-5 max-sm:p-1">المسمى الوظيفي</th>
              <th className="text-center p-3 px-5 max-sm:p-1">الحالة </th>
              <th className="text-center p-3 px-5 max-sm:p-1"> الترتيب </th>
              <th className="text-center p-3 px-5 max-sm:p-1"> انسحاب </th>
            </tr>
            <tr className="focus:outline-none h-16 border border-[#e4e6e6] rounded">
                    <td className="p-3 px-5 max-sm:p-1 text-center">
                        <div className="flex flex-wrap justify-center overflow-y-auto h-6 custom-scrollbar max-sm:h-12">
                            <p className="text-base font-medium max-sm:text-xs leading-none text-gray-700 w-[10ch] break-words max-sm:w-[10ch]">   مطور ويب  </p>
                        </div>
                    </td>
                    
                    <td className="p-3 px-5 max-sm:p-1 text-center">
                        <div className="flex flex-wrap justify-center overflow-y-auto h-7 custom-scrollbar max-sm:h-12">
                            <p className="text-base font-medium max-sm:text-xs leading-none text-gray-700 w-[10ch] break-words max-sm:w-[10ch] ">  
                                <div className='flex gap-2 justify-center'>
                                    <span className="text-base px-4 bg-[#fccd69] py-1 rounded-md text-white font-medium leading-none  mr-2 max-sm:w-10 max-sm:text-[0.7rem] max-sm:px-0.5 max-sm:font-bold">انتظار</span>
                                </div> 
                            </p>
                        </div>
                    </td>
                    <td className="p-3 px-5 max-sm:p-1 text-center">
                        <div className="flex flex-wrap justify-center overflow-y-auto h-6 custom-scrollbar max-sm:h-12">
                            <p className="text-base font-medium max-sm:text-xs leading-none text-gray-700 w-[10ch] break-words max-sm:w-[10ch]"> 10 </p>
                        </div>
                    </td>
                    <td className="p-3 px-5 max-sm:p-1 text-center">
                        <div className="flex flex-wrap justify-center overflow-y-auto h-6 custom-scrollbar max-sm:h-12">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-[#c71919]">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </td>
                    {/* <td className="">
                        <div className="flex items-center ">
                            <button>
                            </button>
                    </div>
                    </td> */}
                </tr>
            </tbody>
        </table>  
    </div>
  </div>
</div> 


{/* </div>  */}
                        
</div>
 
    </>
  )
}

export default DetailsCompanies