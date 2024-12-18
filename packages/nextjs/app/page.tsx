"use client";

//import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
//import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
//import { Address } from "~~/components/scaffold-eth";
import deployedContracts from "../contracts/deployedContracts";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

//const provider = new ethers.providers.Web3Provider(window.ethereum);
//const contract = new ethers.Contract(deployedContracts[31337].YourContract.address, deployedContracts[31337].YourContract.abi, provider.getSigner());
const Home: NextPage = () => {
    const { address: connectedAddress } = useAccount();
    const contract = new ethers.Contract(deployedContracts[31337].YourContract.address, deployedContracts[31337].YourContract.abi, new ethers.providers.Web3Provider(window.ethereum).getSigner());
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [votes1, setVotes1] = useState(0);
    const [votes2, setVotes2] = useState(0);
    const [isChairperson, setChairpersonStatus] = useState(false);


    const getData = async () => {
        try {
            const proposal1 = await contract.proposals(0);
            setName1(await contract.bytes32ToString(proposal1[0]));
            const proposal2 = await contract.proposals(1);
            setName2(await contract.bytes32ToString(proposal2[0]));
            const votes1 = parseInt(proposal1[1]._hex, 16);
            const votes2 = parseInt(proposal2[1]._hex, 16);
            setVotes1(votes1);
            setVotes2(votes2);
        }
        catch (error) {
            console.log(error);
        }
    };

    const checkOwner = async () => {
        try {
            const chairperson = await contract.chairperson()
            setChairpersonStatus(chairperson === connectedAddress);
            console.log(isChairperson);
        }
        catch (error) { console.log(error.message); }
    };

    useEffect(() => {
        getData();
        checkOwner();
    }, [connectedAddress, isChairperson]);

    setInterval(getData, 20000);

    const vote = async (index: number) => {
        try {
            await contract.vote(index);

        } catch (error) {
            alert('You cannot vote.');
        }

    };

    const endVoting = async () => {
        try {
            await contract.endVoting();

        } catch (error) {
            alert('You cannot end voting.');
        }

    };

  return (
      <>
          <div className="flex items-center flex-col flex-grow pt-10 " style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div className="flex items-center flex-col flex-grow pt-10 " style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%%', width: '100%' }}>
                  <div className="px-5" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30%', width: '30%', backgroundColor: '#000000', flexDirection: 'column', margin: '20px' }}>
                      <label style={{ margin: '20px' }}>{name1}</label>
                      <label style={{ margin: '20px' }}>VOTES: {votes1} </label>
                      <button style={{ margin: '20px', width: '50%', height: '50%', color: 'black', backgroundColor: '#ffffff' }} onClick={() => vote(0)} >VOTE </button>
                  </div>
                  <div className="px-5" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30%', width: '30%', backgroundColor: '#000000', flexDirection: 'column', margin: '20px' }}>
                      <label style={{ margin: '20px' }}>{name2}</label>
                      <label style={{ margin: '20px' }}>VOTES: {votes2} </label>
                      <button style={{ margin: '20px', width: '50%', height: '50%', color: 'black', backgroundColor: '#ffffff' }} onClick={() => vote(1)} >VOTE </button>
                  </div>
              </div> {isChairperson && (<button style={{ margin: '20px', width: '100%', height: '100%', backgroundColor: '#ff0000', color: '#ffffff' }} onClick={() => endVoting()} >END VOTING </button>)}
          </div>
      </>
  );
};

export default Home;