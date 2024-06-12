"use client"

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { storeIdentityOnXRPL, getIdentityFromXRPL, verifyIdentityOnXRPL, logIdentityActionOnXRPL } from './xrpl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const contractAddress = require('../variables/address.json');
const abi = require('../variables/abi.json');

function Home() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [identity, setIdentity] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, abi, signer);
                setProvider(provider);
                setSigner(signer);
                setContract(contract);
                const account = await signer.getAddress();
                setAccount(account);
                const role = await contract.roles(account);
                setRole(role);
            }
        };
        init();
    }, []);

    const notify = (message, type = "info") => {
        toast(message, { type });
    };

    const submitIdentity = async () => {
        try {
            await contract.addIdentity(account, name, email);
            await storeIdentityOnXRPL(JSON.stringify({ name, email }));
            await logIdentityActionOnXRPL("Identity Added");
            notify("Identity added successfully", "success");
        } catch (error) {
            notify("Failed to add identity", "error");
        }
    };

    const updateIdentity = async () => {
        try {
            await contract.updateIdentity(account, name, email);
            await logIdentityActionOnXRPL("Identity Updated");
            notify("Identity updated successfully", "success");
        } catch (error) {
            notify("Failed to update identity", "error");
        }
    };

    const verifyIdentity = async () => {
        try {
            await contract.verifyIdentity(account);
            await logIdentityActionOnXRPL("Identity Verified");
            notify("Identity verified successfully", "success");
        } catch (error) {
            notify("Failed to verify identity", "error");
        }
    };

    const revokeIdentity = async () => {
        try {
            await contract.revokeIdentity(account);
            await logIdentityActionOnXRPL("Identity Revoked");
            notify("Identity revoked successfully", "success");
        } catch (error) {
            notify("Failed to revoke identity", "error");
        }
    };

    const deleteIdentity = async () => {
        try {
            await contract.deleteIdentity(account);
            await logIdentityActionOnXRPL("Identity Deleted");
            notify("Identity deleted successfully", "success");
        } catch (error) {
            notify("Failed to delete identity", "error");
        }
    };

    const fetchIdentity = async () => {
        try {
            const identity = await contract.getIdentity(account);
            setIdentity(identity);
            const xrplIdentity = await getIdentityFromXRPL(account);
            console.log('Identity from XRPL:', xrplIdentity);
            notify("Identity fetched successfully", "success");
        } catch (error) {
            notify("Failed to fetch identity", "error");
        }
    };

    const verifyIdentityOnXRPL = async () => {
        try {
            const exists = await verifyIdentityOnXRPL(account);
            console.log('Identity exists on XRPL:', exists);
            notify(`Identity exists on XRPL: ${exists}`, "info");
        } catch (error) {
            notify("Failed to verify identity on XRPL", "error");
        }
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <button className="btn btn-primary" onClick={getRole}>Get Role</button>
            <h2>Identity Verification</h2>
            <div className="form-group">
                <input
                    className="form-control"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="form-control mt-2"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            {role === '0' && (
                <>
                    <button className="btn btn-success mt-2" onClick={submitIdentity}>Submit Identity</button>
                    <button className="btn btn-warning mt-2" onClick={updateIdentity}>Update Identity</button>
                </>
            )}
            {role === '2' && <button className="btn btn-info mt-2" onClick={verifyIdentity}>Verify Identity</button>}
            {role === '1' && (
                <>
                    <button className="btn btn-danger mt-2" onClick={revokeIdentity}>Revoke Identity</button>
                    <button className="btn btn-dark mt-2" onClick={deleteIdentity}>Delete Identity</button>
                </>
            )}
            <button className="btn btn-primary mt-2" onClick={fetchIdentity}>Fetch Identity</button>
            <button className="btn btn-secondary mt-2" onClick={verifyIdentityOnXRPL}>Verify Identity on XRPL</button>
            {identity && (
                <div className="mt-3">
                    <p>Name: {identity.name}</p>
                    <p>Email: {identity.email}</p>
                    <p>Verified: {identity.isVerified ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
}

export default Home;
