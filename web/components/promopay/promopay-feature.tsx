'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { usePromoPayProgram } from './promopay-data-access';
import { CreateCustomerForm, PromoPayInitialize, CreateServiceProviderForm, CreateWeb3ProjectForm, PayToProviderForm } from './promopay-ui';

export default function PromopayFeature() {
  const { publicKey } = useWallet();
  const { programId } = usePromoPayProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="Promopay"
        subtitle={
          'Create a new account by clicking the "Create" button. The state of an account is stored on-chain and can be manipulated by calling the program\'s methods.'
        }
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <PromoPayInitialize />
        <CreateCustomerForm />
        <CreateServiceProviderForm />
        <CreateWeb3ProjectForm />
        <PayToProviderForm />
      </AppHero>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
