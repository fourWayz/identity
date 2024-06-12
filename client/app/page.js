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
                fetchIdentity();
            }
        };
        init();
    }, []);

    const notify = (message, type = "info") => {
        toast(message, { type });
    };

    const submitIdentity = async () => {
        try {
            await contract.addIdentity(name, email);
            await storeIdentityOnXRPL(JSON.stringify({ name, email }));
            await logIdentityActionOnXRPL("Identity Added");
            notify("Identity added successfully", "success");
            fetchIdentity();
        } catch (error) {
            notify("Failed to add identity", "error");
        }
    };

    const updateIdentity = async () => {
        try {
            await contract.updateIdentity(name, email);
            await logIdentityActionOnXRPL("Identity Updated");
            notify("Identity updated successfully", "success");
            fetchIdentity();
        } catch (error) {
            notify("Failed to update identity", "error");
        }
    };

    const verifyIdentity = async () => {
        try {
            await contract.verifyIdentity();
            await logIdentityActionOnXRPL("Identity Verified");
            notify("Identity verified successfully", "success");
            fetchIdentity();
        } catch (error) {
            notify("Failed to verify identity", "error");
        }
    };

    const revokeIdentity = async () => {
        try {
            await contract.revokeIdentity();
            await logIdentityActionOnXRPL("Identity Revoked");
            notify("Identity revoked successfully", "success");
            fetchIdentity();
        } catch (error) {
            notify("Failed to revoke identity", "error");
        }
    };

    const deleteIdentity = async () => {
        try {
            await contract.deleteIdentity();
            await logIdentityActionOnXRPL("Identity Deleted");
            notify("Identity deleted successfully", "success");
            fetchIdentity();
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

    const renderConnectButton = () => {
        return (
            <button className="btn btn-primary" onClick={async () => {
                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    await provider.send("eth_requestAccounts", []);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(contractAddress, abi, signer);
                    setProvider(provider);
                    setSigner(signer);
                    const account = await signer.getAddress();
                    setAccount(account);
                    fetchIdentity();
                }
            }}>
                {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
            </button>
        );
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h1>Cross-Chain Identity Verification</h1>
                {renderConnectButton()}
            </header>
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
            <button
                className="btn btn-success mt-2"
                onClick={submitIdentity}
                disabled={identity && identity.exists}
            >
                Submit Identity
            </button>
            <button
                className="btn btn-warning mt-2"
                onClick={updateIdentity}
                disabled={!identity || !identity.exists}
            >
                Update Identity
            </button>
            <button
                className="btn btn-info mt-2"
                onClick={verifyIdentity}
                disabled={!identity || !identity.exists || identity.isVerified}
            >
                Verify Identity
            </button>
            <button
                className="btn btn-danger mt-2"
                onClick={revokeIdentity}
                disabled={!identity || !identity.exists || !identity.isVerified}
            >
                Revoke Identity
            </button>
            <button
                className="btn btn-dark mt-2"
                onClick={deleteIdentity}
                disabled={!identity || !identity.exists}
            >
                Delete Identity
            </button>
            <button
                className="btn btn-primary mt-2"
                onClick={fetchIdentity}
            >
                Fetch Identity
            </button>
            <button
                className="btn btn-secondary mt-2"
                onClick={verifyIdentityOnXRPL}
            >
                Verify Identity on XRPL
            </button>
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