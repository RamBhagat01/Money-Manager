import { useState , useRef, useEffect } from "react";
import {RecoilRoot , atom , useRecoilValue , useSetRecoilState} from 'recoil';

const userAtom = atom({
  default : JSON.parse(localStorage.getItem("friendsArray")) || [ 
    { name: 'ankit ',
      amount: '50',
      //finalIncomming: true ,
      id : 1781357174088
    },
    { name: 'samit',
      amount: '130',
      //finalIncomming: true,
      id : 1781357174089
    },
    { name: 'yash',
      amount: '200',
      //finalIncomming: true ,
      id : 1781357174090
    }
  ],
  key : "friendsArray"
});

const reasonAtom = atom({
  default :   JSON.parse(localStorage.getItem("userReasons")) || [{
    userId : 1781357174088 ,
    reasons : [{r:'shuttle', a:1000 , i : true}, {r:'milk', a:50 , i : false}]
  },{
    userId : 1781357174089 ,
    reasons : [{r : 'milk', a:130 , i : true }]
  },{
    userId : 1781357174090 ,
    reasons : [{r:'chips/instamart' , a:200 , i : true}]
  }],
  key : "userReasons"
})

export default function App(){
  return(
    <RecoilRoot>
      <Render />
    </RecoilRoot>    
  )
}
  
function Render(){

  const nameInput = useRef();
  const amountInput = useRef();
  const moneyReason = useRef(); 
  // input is a object = {current :0}

  const user = useRecoilValue(userAtom);
  // using recoil getter !!

  //using recoil setter !!
  const setUser = useSetRecoilState(userAtom);

  const userReason = useRecoilValue(reasonAtom);
  const setuserReason = useSetRecoilState(reasonAtom);

  const [bool , setBool] = useState(false) ;
  //used for the edit hisab button;

  const [search , setSearch] = useState(false) ;
  // for searching the box ; 

  const amountInputMore = useRef();
  const moneyReasonMore = useRef();

  //for boolean values
  const radioIncomming = useRef();

  //for extra added boolean values
  const radioMoreIncomming = useRef();

  // for the final incomming out going calculations
  const t = universalTotal();

  useEffect(() => {
    localStorage.setItem("friendsArray", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("userReasons", JSON.stringify(userReason));
  }, [userReason]);

  return (
    <div className="flex flex-col justify-center items-center">
      <span className="font-bold text-xl">RBS MONEY TRACKER</span>
      <br />
      <input type={'text'} ref={nameInput} placeholder="Name" className="border-3 my-[-8px] p-[4px]"/>
      <br />
      <input type={'number'} ref ={amountInput} placeholder="amount" className="border-3 my-[-8px]  p-[4px]"/>
      <br />
      <input type={'text'} ref ={moneyReason} placeholder="Reason" className="border-3 my-[-8px]  p-[4px]" />
      <br />

      <form className="flex flex-col gap-[3px] justify-center items-center">
        <div>
          <input type="radio" id="outgoing" name="radio" value="false" ref={radioIncomming} className="cursor-pointer"/>
          <label className="font-bold ml-[5px]">Outgoing</label>
        </div>

        <div>
          <input type="radio" id="incomming" name="radio" value="true" ref={radioIncomming} className="cursor-pointer"/>
          <label className="font-bold ml-[5px]">Incomming</label>
        </div>
      </form>

      <button onClick={()=>{
        setNewHisab()
      }} className="border rounded-[30px] py-[5px] px-[40px] mt-[10px] cursor-pointer font-bold hover:bg-green-400 bg-green-300 border-3">
        Add
      </button>

      <div className="border-5 rounded-[50px] p-5 m-4 bg-yellow-300 min-w-[300px] mx-[20px]">
        <div className="border-3  rounded-[20px] my-[5px] py-[10px] flex flex-col  gap-[-10px] items-center justify-center bg-white">
          <div><strong>Total Incomming Money:</strong> ₹{Math.abs(t.totalPositive)}</div>
          <br />
          <div><strong>Total Outgoing Money :</strong> ₹{Math.abs(t.totalNegative)}</div>
        </div>
        
        <span className="flex flex-col items-center justify-center font-bold text-xl">Users</span>
        <br />
        {/* {search} */}

        <div >
          {console.log(user)}
          {console.log(userReason)}
          
          {user.map(user => 
            <div className="border-3 p-3 my-3 rounded-[20px] bg-white">
              <div className="flex flex-row gap-[5px] justify-center">
                <span className="font-bold ">Name:</span> <span className="inline-block max-w-[250px] break-words whitespace-normal mb-[-100px]">{(user.name).toUpperCase()}</span> 
              </div>
              <br />

              {/* Total Amount: ₹{user.amount} to be {(user.finalIncomming) ?'📥(incomming)' :'📤(outgoing)'} */}

              <span className="font-bold">Total Amount:</span> ₹{Math.abs(getTotal(user.id))} to be {
                (getTotal(user.id) >= 0) ? '📥(incoming)': '📤(outgoing)'
              }

              <div className="flex justify-center mt-[20px] mb-[10px]">
              <table >
                <thead>
                  <tr className="border-2">
                    <th className="border-2 px-[5px] py-[3px] text-center">Reason</th>
                    <th className="border-2 px-[5px] py-[3px] text-center">Amount</th>
                    <th className="border-2 px-[5px] py-[3px] text-center">IN/OUT</th>
                  </tr>
                </thead>

                <tbody>
                  {userReason.map((reason) => {
                    if (user.id === reason.userId) {
                      return reason.reasons.map((reason1, index) => (
                        <tr key={index}>
                          <td className="border-2 px-[5px] py-[3px] text-center max-w-[100px] break-words whitespace-normal">{reason1.r}</td>
                          <td className="border-2 px-[5px] py-[3px] text-center max-w-[100px] break-words whitespace-normal">₹{reason1.a}</td>
                          <td className="border-2 px-[5px] py-[3px] text-center max-w-[100px] break-words whitespace-normal">{reason1.i ? "📥 Incoming" : "📤 Outgoing"}</td>
                        </tr>
                      ));
                    }

                    //if nothing matched with the reason then return null instead of an error !!
                    return null;
                  })}
                </tbody>
              </table>
              </div>

              <div>
                <div className="flex flex-row">
                {
                  (bool) 
                  ? '' 
                  : <button onClick={()=> {

                    searchUserFromButton(user.id);
                    setBool(prev => true);

                  }} id={user.id} className="border-2 rounded-[10px] px-3 py-1 my-2 mx-4 font-bold cursor-pointer hover:bg-green-400 bg-green-300">
                    New Hisab
                  </button>
                } 

                {(bool) 
                ?'' 
                :<button onClick={()=>{

                  hisabKahatam(user.id);

                }} className="border-2 rounded-[10px] px-3 py-1 my-2 mx-4 font-bold cursor-pointer hover:bg-red-400 bg-red-300">
                  Hisab Khatam
                  </button>
                } 
                </div>

                {/* "if-else" statements are not used in react INSTEAD use "ternary operator" */}
                
                {(bool && search === user.id)?
                  ( 
                  
                  <div className="border-4 rounded-[20px] my-[10px] flex flex-col justify-center items-center gap-[-10px] px-[15px] py-[25px] bg-pink-200">
                    <input type={'text'} ref ={moneyReasonMore} placeholder="Reason" className="border-3 rounded-[10px] my-[-8px] p-[4px] bg-white"/>
                    <br />
                    <input type={'number'} ref ={amountInputMore} placeholder="amount" className="border-3 rounded-[10px] my-[-8px] p-[4px] bg-white"/>
                    <br /> 

                    <form>

                      <input type="radio" id="outgoing" name="radio" value="false" ref={radioMoreIncomming} className="cursor-pointer "/>
                      <label className="font-bold ml-[5px]">Outgoing</label>
                      <br />
                      <input type="radio" id="incomming" name="radio" value="true" ref={radioMoreIncomming} className="cursor-pointer "/>
                      <label className="font-bold ml-[5px]">Incomming</label>
                      <br/>

                    </form>

                    <button onClick={setMoreHisab} className="border-3 hover:bg-red-400 cursor-pointer font-bold py-[3px] mt-[15px] rounded-[20px] w-[200px] bg-rose-300">
                      Save
                    </button>
                  </div>)
                  :''
                }

              </div>
              
            </div>
            )
          }
        </div>
        
        <div className="flex flex-col justify-center items-center font-extrabold text-xl text-black/50 mt-[50px]">
          <hr className=" w-full border-2 border-black/50 my-4" />
          <div>Made By: Ram Bhagat Soni</div>
          <div>Frontend Project in React.js</div>
          <div>For styling : Tailwind-css</div>
          <div>On : June-2026 </div>
        </div>
      </div>
    </div>
  )

  function setNewHisab(){

    if((nameInput.current.value=== '') || (amountInput.current.value === '') || ( moneyReason.current.value === '') ||(radioIncomming.current.value === '')){
      alert('Please Enter NAME and AMOUNT and REASON');
    }
    else{

      const time = Date.now();

      setuserReason(prev => [
        ...prev,
      {
        userId : time ,
        reasons : [{
          r: moneyReason.current.value,
          a: amountInput.current.value ,
          i: radioIncomming.current.checked
        }]
      }
      ])
    
      setUser(prev => [
        ...prev,
      {
        name : nameInput.current.value,
        amount : amountInput.current.value, 
        id : time
      }
      ])
    } 
  }

  function searchUserFromButton(prop){

    //console.log(prop);

    user.map(user => {
      if (prop === user.id){
        //console.log(user);
        
        setSearch(p => prop);
        //console.log(search);
      }
    }) 
  }
  
  function setMoreHisab() {

    // console.log(moneyReasonMore.current.value);
    // console.log(amountInputMore.current.value);
    // console.log(radioMoreIncomming.current.checked);

    if (moneyReasonMore.current.value === '' || amountInputMore.current.value === '' || radioMoreIncomming.current.checked === '') {
      alert('Please Enter REASON and AMOUNT');
      setBool(false);
      return;
    }

    // Most difficult part of this whole project !!

    setuserReason(prev =>
      prev.map(item => {
        if (item.userId === search) {
          return {
            ...item,
            reasons: [
              ...item.reasons,
              {
                r: moneyReasonMore.current.value,
                a: amountInputMore.current.value,
                i: radioMoreIncomming.current.checked
              }
            ]
          };
        }

        return item;
      })
    );

    setBool(false);
  }

  function hisabKahatam(prop) {

    console.log('kahatam-function');

    setUser(prev => prev.filter(user => (user.id !== prop)));
    setuserReason(prev => prev.filter(user => (user.userId !== prop)));


    // user.filter(user => (user.id !== search))
    // console.log(user);
    // console.log(userReason);
  }

  function getTotal(userId) {

    const data = userReason.find(item => 
      item.userId === userId
    );

    let total = 0;

    data?.reasons.forEach(reason => {
      if (reason.i === true) {
        total += Number(reason.a);
      } else {
        total -= Number(reason.a);
      }
    });

    return (total);
  }

  function universalTotal(){

    let totalPositive = 0;
    let totalNegative = 0;
    let total =0

    user.forEach(user => {

      total = (getTotal(user.id));

      if(total >= 0){
        totalPositive += total
      }
      else if(total < 0){
        totalNegative += total;
      }
        
    })

    return{
      totalNegative,
      totalPositive
    }

  }

 
}

