import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { usePromoPayProgram } from './promopay-data-access';

export function PromoPayApp() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">PromoPay</h1>
      <div className="space-y-8">
        <PromoPayInitialize />
        <CreateCustomerForm />
        <CreateServiceProviderForm />
        <CreateWeb3ProjectForm />
        <PayToProviderForm />
      </div>
    </div>
  );
}

export function PromoPayInitialize() {
  const { initialize } = usePromoPayProgram();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Initialize PromoPay</h2>
      <button
        className="btn btn-primary"
        onClick={() => initialize.mutate()}
        disabled={initialize.isPending}
      >
        Initialize {initialize.isPending && '...'}
      </button>
    </div>
  );
}

export function CreateCustomerForm() {
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const { createCustomer } = usePromoPayProgram();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomer.mutate({ name, interests });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Interests"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary" disabled={createCustomer.isPending}>
          Create Customer {createCustomer.isPending && '...'}
        </button>
      </form>
    </div>
  );
}

export function CreateServiceProviderForm() {
  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [providerCode, setProviderCode] = useState('');
  const { createServiceProvider } = usePromoPayProgram();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createServiceProvider.mutate({ name, serviceType, location, providerCode });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create Service Provider</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Service Type"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Provider Code"
          value={providerCode}
          onChange={(e) => setProviderCode(e.target.value)}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary" disabled={createServiceProvider.isPending}>
          Create Service Provider {createServiceProvider.isPending && '...'}
        </button>
      </form>
    </div>
  );
}

export function CreateWeb3ProjectForm() {
  const [projectName, setProjectName] = useState('');
  const [promotionalVideo, setPromotionalVideo] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [rewardPerUser, setRewardPerUser] = useState('');
  const [promoDuration, setPromoDuration] = useState('');
  const [makeUsersEligibleForAirdrops, setMakeUsersEligibleForAirdrops] = useState(false);
  const [promoType, setPromoType] = useState('');
  const { createWeb3Project } = usePromoPayProgram();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWeb3Project.mutate({
      projectName,
      promotionalVideo,
      projectLink,
      totalBudget: Number(totalBudget),
      rewardPerUser: Number(rewardPerUser),
      promoDuration: Number(promoDuration),
      makeUsersEligibleForAirdrops,
      promoType,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create Web3 Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Promotional Video URL"
          value={promotionalVideo}
          onChange={(e) => setPromotionalVideo(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Project Link"
          value={projectLink}
          onChange={(e) => setProjectLink(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="number"
          placeholder="Total Budget"
          value={totalBudget}
          onChange={(e) => setTotalBudget(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="number"
          placeholder="Reward Per User"
          value={rewardPerUser}
          onChange={(e) => setRewardPerUser(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="number"
          placeholder="Promo Duration (in days)"
          value={promoDuration}
          onChange={(e) => setPromoDuration(e.target.value)}
          className="input input-bordered w-full"
        />
        <label className="label cursor-pointer">
          <span className="label-text">Make Users Eligible for Airdrops</span>
          <input
            type="checkbox"
            checked={makeUsersEligibleForAirdrops}
            onChange={(e) => setMakeUsersEligibleForAirdrops(e.target.checked)}
            className="checkbox"
          />
        </label>
        <input
          type="text"
          placeholder="Promo Type"
          value={promoType}
          onChange={(e) => setPromoType(e.target.value)}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary" disabled={createWeb3Project.isPending}>
          Create Web3 Project {createWeb3Project.isPending && '...'}
        </button>
      </form>
    </div>
  );
}

export function PayToProviderForm() {
  const [customerPublicKey, setCustomerPublicKey] = useState('');
  const [serviceProviderPublicKey, setServiceProviderPublicKey] = useState('');
  const [web3ProjectPublicKey, setWeb3ProjectPublicKey] = useState('');
  const [amountPaidByCustomer, setAmountPaidByCustomer] = useState('');
  const { payToProvider } = usePromoPayProgram();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    payToProvider.mutate({
      customerPublicKey: new PublicKey(customerPublicKey),
      serviceProviderPublicKey: new PublicKey(serviceProviderPublicKey),
      web3ProjectPublicKey: new PublicKey(web3ProjectPublicKey),
      amountPaidByCustomer: Number(amountPaidByCustomer),
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Pay To Provider</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Customer Public Key"
          value={customerPublicKey}
          onChange={(e) => setCustomerPublicKey(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Service Provider Public Key"
          value={serviceProviderPublicKey}
          onChange={(e) => setServiceProviderPublicKey(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Web3 Project Public Key"
          value={web3ProjectPublicKey}
          onChange={(e) => setWeb3ProjectPublicKey(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="number"
          placeholder="Amount Paid By Customer"
          value={amountPaidByCustomer}
          onChange={(e) => setAmountPaidByCustomer(e.target.value)}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary" disabled={payToProvider.isPending}>
          Pay To Provider {payToProvider.isPending && '...'}
        </button>
      </form>
    </div>
  );
}