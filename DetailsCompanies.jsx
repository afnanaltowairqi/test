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
                                <button onClick={() => {
                                    jobApplied(job, index);
                                    document.getElementById('my_modal_1').showModal();
                                }}
                                className="text-base px-4 bg-[#7ed191] py-1  rounded-md text-white font-medium leading-none  mr-2 max-sm:w-10 max-sm:text-[0.7rem] max-sm:px-0.5 max-sm:font-bold">تقديم</button>
                                <dialog id="my_modal_1" className="modal modal-bottom sm:modal-middle">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">هل انت متأكد من التقديم؟</h3>
                                    <div className="modal-action">
                                    <form method="dialog" className='flex justify-center items-center gap-2 w-full '>
                                        <button onClick={()=>document.getElementById('my_modal_2').showModal()} className="rounded-lg bg-[#7ed191] text-white hover:bg-[#94e6a7] w-[5vw] h-[6vh] max-sm:w-[12vw] max-sm:h-[4vh]">نعم</button>
                                        <dialog id="my_modal_2" className="modal modal-bottom sm:modal-middle ">
                                            <div className="modal-box">
                                            <div className='flex flex-col justify-center items-center gap-4'>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 512 512">
                                            <path fill="#32BEA6" d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"></path><path fill="#FFF" d="M392.6,172.9c-5.8-15.1-17.7-12.7-30.6-10.1c-7.7,1.6-42,11.6-96.1,68.8c-22.5,23.7-37.3,42.6-47.1,57c-6-7.3-12.8-15.2-20-22.3C176.7,244.2,152,229,151,228.4c-10.3-6.3-23.8-3.1-30.2,7.3c-6.3,10.3-3.1,23.8,7.2,30.2c0.2,0.1,21.4,13.2,39.6,31.5c18.6,18.6,35.5,43.8,35.7,44.1c4.1,6.2,11,9.8,18.3,9.8c1.2,0,2.5-0.1,3.8-0.3c8.6-1.5,15.4-7.9,17.5-16.3c0.1-0.2,8.8-24.3,54.7-72.7c37-39.1,61.7-51.5,70.3-54.9c0.1,0,0.1,0,0.3,0c0,0,0.3-0.1,0.8-0.4c1.5-0.6,2.3-0.8,2.3-0.8c-0.4,0.1-0.6,0.1-0.6,0.1l0-0.1c4-1.7,11.4-4.9,11.5-5C393.3,196.1,397,184.1,392.6,172.9z"></path>
                                            </svg>
                                            <h3 className="font-bold text-lg">تم التقديم بنجاح</h3>
                                            </div>
                                            <div className="modal-action">
                                            <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                            </form>
                                            </div>
                                        </div>
                                        </dialog>
                                        <button className="rounded-lg  text-black border border-[#a3a3a3] hover:bg-[#f0f0f0] w-[5vw] h-[6vh] max-sm:w-[12vw] max-sm:h-[4vh] ">لا</button>
                                    </form>
                                    </div>
                                </div>
                            </dialog>
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
                            <svg className="size-6 text-[#c71919] cursor-pointer" onClick={()=>document.getElementById('my_modal_3').showModal()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" >
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                            </svg>
                            <dialog id="my_modal_3" className="modal modal-bottom sm:modal-middle">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg">هل انت متأكد من الانسحاب؟</h3>
                                    <div className="modal-action">
                                    <form method="dialog" className='flex justify-center items-center gap-2 w-full '>
                                        <button className="rounded-lg bg-red-600 text-white hover:bg-red-500 w-[5vw] h-[6vh] max-sm:w-[12vw] max-sm:h-[4vh]">نعم</button>
                                        <button className="rounded-lg  text-black border border-[#a3a3a3] hover:bg-[#f0f0f0] w-[5vw] h-[6vh] max-sm:w-[12vw] max-sm:h-[4vh] ">لا</button>
                                    </form>
                                    </div>
                                </div>
                            </dialog>
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