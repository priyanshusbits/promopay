import { Program } from '@coral-xyz/anchor';

import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

// Assume we have a function to get the PromoPay program
import { getPromopayProgram, getPromopayProgramId } from '@promopay/anchor';

export function usePromoPayProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getPromopayProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getPromopayProgram(provider);

  const initialize = useMutation({
    mutationKey: ['promopay', 'initialize', { cluster }],
    mutationFn: () => program.methods.initialize().rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: () => toast.error('Failed to initialize PromoPay'),
  });

  const createCustomer = useMutation({
    mutationKey: ['promopay', 'createCustomer', { cluster }],
    mutationFn: ({ name, interests }: { name: string; interests: string }) => {
      const customer = Keypair.generate();
      return program.methods
        .createCustomer(name, interests)
        .accounts({
          customer: customer.publicKey,
          payer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([customer])
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: () => toast.error('Failed to create customer'),
  });

  const createServiceProvider = useMutation({
    mutationKey: ['promopay', 'createServiceProvider', { cluster }],
    mutationFn: ({
      name,
      serviceType,
      location,
      providerCode,
    }: {
      name: string;
      serviceType: string;
      location: string;
      providerCode: string;
    }) => {
      const serviceProvider = Keypair.generate();
      const codeToProvider = Keypair.generate();
      return program.methods
        .createServiceProvider(name, serviceType, location, providerCode)
        .accounts({
          serviceProvider: serviceProvider.publicKey,
          codeToProvider: codeToProvider.publicKey,
          payer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([serviceProvider, codeToProvider])
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: () => toast.error('Failed to create service provider'),
  });

  const createWeb3Project = useMutation({
    mutationKey: ['promopay', 'createWeb3Project', { cluster }],
    mutationFn: ({
      projectName,
      promotionalVideo,
      projectLink,
      totalBudget,
      rewardPerUser,
      promoDuration,
      makeUsersEligibleForAirdrops,
      promoType,
    }: {
      projectName: string;
      promotionalVideo: string;
      projectLink: string;
      totalBudget: number;
      rewardPerUser: number;
      promoDuration: number;
      makeUsersEligibleForAirdrops: boolean;
      promoType: string;
    }) => {
      const web3Project = Keypair.generate();
      return program.methods
        .createWeb3Project(
          projectName,
          promotionalVideo,
          projectLink,
          new anchor.BN(totalBudget),
          new anchor.BN(rewardPerUser),
          new anchor.BN(promoDuration),
          makeUsersEligibleForAirdrops,
          promoType
        )
        .accounts({
          web3Project: web3Project.publicKey,
          payer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([web3Project])
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: () => toast.error('Failed to create Web3 project'),
  });

  const payToProvider = useMutation({
    mutationKey: ['promopay', 'payToProvider', { cluster }],
    mutationFn: ({
      customerPublicKey,
      serviceProviderPublicKey,
      web3ProjectPublicKey,
      amountPaidByCustomer,
    }: {
      customerPublicKey: PublicKey;
      serviceProviderPublicKey: PublicKey;
      web3ProjectPublicKey: PublicKey;
      amountPaidByCustomer: number;
    }) => {
      return program.methods
        .payToProvider(new anchor.BN(amountPaidByCustomer))
        .accounts({
          customer: customerPublicKey,
          serviceProvider: serviceProviderPublicKey,
          web3Project: web3ProjectPublicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: () => toast.error('Failed to pay service provider'),
  });

  return {
    program,
    programId,
    initialize,
    createCustomer,
    createServiceProvider,
    createWeb3Project,
    payToProvider,
  };
}