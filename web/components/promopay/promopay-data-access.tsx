'use client';

import { getPromopayProgram, getPromopayProgramId } from '@promopay/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function usePromopayProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getPromopayProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getPromopayProgram(provider);

  const accounts = useQuery({
    queryKey: ['promopay', 'all', { cluster }],
    queryFn: () => program.account.promopay.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['promopay', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ promopay: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function usePromopayProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = usePromopayProgram();

  const accountQuery = useQuery({
    queryKey: ['promopay', 'fetch', { cluster, account }],
    queryFn: () => program.account.promopay.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['promopay', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ promopay: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['promopay', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ promopay: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['promopay', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ promopay: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['promopay', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ promopay: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
