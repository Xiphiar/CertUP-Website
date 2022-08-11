import { useState, useEffect, useRef } from 'react';
import { Permit, SecretNetworkClient, Snip20Querier } from 'secretjs';
import { Snip721GetTokensResponse } from 'secretjs/dist/extensions/snip721/msg/GetTokens';
import { useWallet } from '../contexts';
import {
  BatchDossierResponse,
  DossierResponse,
  PermitSignature,
  RemainingCertsResponse,
} from '../interfaces';
import { permissions, allowedTokens, permitName } from '../utils/loginPermit';

interface TokenApprovalsResponse {
  token_approvals: TokenApprovals;
}

export interface TokenApprovals {
  owner_is_public: boolean;
  public_ownership_expiration: Snip721Expiration;
  private_metadata_is_public: boolean;
  private_metadata_is_public_expiration: Snip721Expiration;
  token_approvals: Snip721Approval[];
}

export interface Snip721Approval {
  address: string;
  view_owner_expiration: Snip721Expiration;
  view_private_metadata_expiration: Snip721Expiration;
  transfer_expiration: Snip721Expiration;
}

enum Snip721Expiration {
  'never',
  TimeExpiration,
  HeightExpiration,
}

interface TimeExpiration {
  at_time: number;
}
interface HeightExpiration {
  at_height: number;
}

export class WithPermit {
  query: object;
  permit: Permit;
  constructor(query: object, signature: PermitSignature) {
    this.query = query || {};
    this.permit = {
      params: {
        permit_name: permitName,
        allowed_tokens: allowedTokens,
        chain_id: process.env.REACT_APP_CHAIN_ID as string,
        permissions: permissions,
      },
      signature: signature,
    };
  }
}

const checkError = (queryResponse: any) => {
  if (queryResponse.parse_err || queryResponse.generic_err) {
    console.error(queryResponse.parse_err || queryResponse.generic_err);
    throw new Error(
      queryResponse.parse_err.msg || queryResponse.generic_err.msg || queryResponse.parse_err
        ? JSON.stringify(queryResponse.parse_err)
        : undefined || queryResponse.generic_err
        ? JSON.stringify(queryResponse.generic_err)
        : undefined || JSON.stringify(queryResponse),
    );
  }
};

export default function useQuery() {
  const { Address, QueryPermit, Querier } = useWallet();
  //const querier = useRef<SecretNetworkClient>();

  // useEffect(() => {
  //   const run = async () => {
  //     querier.current = await SecretNetworkClient.create({
  //       grpcWebUrl: process.env.REACT_APP_GRPC_URL as string,
  //       chainId: process.env.REACT_APP_CHAIN_ID as string,
  //     });
  //   };
  //   run();
  // });

  const queryCredits = async () => {
    if (!Querier) throw new Error('Client not available.');
    if (!QueryPermit) throw new Error('QueryPermit not available.');

    const query = {
      with_permit: {
        query: {
          remaining_certs: {
            viewer: {
              address: Address,
            },
          },
        },
        permit: {
          params: {
            permit_name: permitName,
            allowed_tokens: allowedTokens,
            chain_id: process.env.REACT_APP_CHAIN_ID,
            permissions: permissions,
          },
          signature: QueryPermit,
        },
      },
    };

    const response: RemainingCertsResponse | undefined = await Querier.query.compute.queryContract({
      contractAddress: process.env.REACT_APP_MANAGER_ADDR as string,
      codeHash: process.env.REACT_APP_MANAGER_HASH as string,
      query: query,
    });
    if (!response || response.parse_err || response.generic_err)
      throw new Error((response.parse_err || response.generic_err || '').toString());
    //setRemainingCerts(parseInt(response.remaining_certs.certs || '0', 10));
    return parseInt(response.remaining_certs?.certs || '0', 10);
  };

  const getOwnedCerts = async () => {
    if (!Querier) throw new Error('Querier not available.');
    if (!QueryPermit) throw new Error('QueryPermit not available.');

    // query owned token IDs
    const tokensQuery = {
      tokens: {
        owner: Address,
      },
    };

    const { token_list } = (await queryPermitNFTContract(tokensQuery)) as Snip721GetTokensResponse;
    if (!token_list.tokens.length) return [];

    // query NFT metadata
    const dossierQuery = {
      batch_nft_dossier: {
        token_ids: token_list.tokens,
      },
    };

    const response = (await queryPermitNFTContract(dossierQuery)) as BatchDossierResponse;

    return response.batch_nft_dossier.nft_dossiers;
  };

  const getCert = async (token_id: string) => {
    if (!Querier) throw new Error('Querier not available.');
    if (!QueryPermit) throw new Error('QueryPermit not available.');

    // query NFT metadata
    const dossierQuery = {
      nft_dossier: {
        token_id: token_id,
      },
    };

    const response = (await queryPermitNFTContract(dossierQuery)) as DossierResponse;

    return response.nft_dossier;
  };

  const getSSCRTBalance = async () => {
    if (!Querier) throw new Error('Querier not available.');

    //get view key
    const vkey = await window.keplr?.getSecret20ViewingKey(
      process.env.REACT_APP_CHAIN_ID as string,
      process.env.REACT_APP_SSCRT_ADDR as string,
    );
    console.log(vkey);

    const response = await Querier.query.snip20.getBalance({
      contract: {
        address: process.env.REACT_APP_SNIP20_ADDR as string,
        codeHash: process.env.REACT_APP_SNIP20_HASH as string,
      },
      address: Address,
      auth: {
        key: vkey,
      },
    });
    checkError(response);
    return parseInt(response.balance?.amount || '0', 10) / 10e5;
  };

  const getSCRTBalance = async (): Promise<number> => {
    if (!Querier) throw new Error('Querier not available.');

    const response = await Querier.query.bank.balance({
      address: Address,
      denom: 'uscrt',
    });
    checkError(response);
    return parseInt(response.balance?.amount || '0', 10) / 10e5;
  };

  const queryNFTContract = async (query: object) => {
    if (!Querier) throw new Error('Querier not available.');

    const response = await Querier.query.compute.queryContract({
      contractAddress: process.env.REACT_APP_NFT_ADDR as string,
      codeHash: process.env.REACT_APP_NFT_HASH as string,
      query: query,
    });
    checkError(response);
    return response;
  };

  const queryPermitNFTContract = async (query: object) => {
    const permitQuery = {
      with_permit: {
        query: query,
        permit: {
          params: {
            permit_name: permitName,
            allowed_tokens: allowedTokens,
            chain_id: process.env.REACT_APP_CHAIN_ID,
            permissions: permissions,
          },
          signature: QueryPermit,
        },
      },
    };
    //console.log('wrapped permit query', permitQuery);

    return await queryNFTContract(permitQuery);
  };

  const queryNFTWhitelist = async (token_id: string): Promise<TokenApprovals> => {
    if (!Querier) throw new Error('Querier not available.');
    if (!QueryPermit) throw new Error('QueryPermit not available.');

    // query NFT metadata
    const approvalQuery = {
      token_approvals: {
        token_id: token_id,
        include_expired: true,
      },
    };

    const response = (await queryPermitNFTContract(approvalQuery)) as TokenApprovalsResponse;

    return response.token_approvals;
  };

  return {
    queryCredits,
    getOwnedCerts,
    getCert,
    getSSCRTBalance,
    getSCRTBalance,
    queryNFTContract,
    queryPermitNFTContract,
    queryNFTWhitelist,
  };
}
