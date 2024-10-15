import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { HttpClient } from '@angular/common/http';
import { create } from 'ipfs-http-client';

// Contract ABI and address
//import * as contractABI from '';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private web3: any;
  private contract: any;
  private contractAddress = '';
  private account: string = '';
  private ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

  constructor(private http: HttpClient) {
    this.loadWeb3();
  }

  // Load Web3 instance and connect to Ethereum
  async loadWeb3() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      this.account = (await this.web3.eth.getAccounts())[0];
      this.contract = new this.web3.eth.Contract((contractABI as any).default, this.contractAddress);
    } else {
      console.error('MetaMask not detected');
    }
  }

  // Upload file to IPFS
  async uploadToIPFS(file: File): Promise<string> {
    const addedFile = await this.ipfs.add(file);
    return addedFile.path;
  }

  // Register research content on the blockchain
  async registerContent(title: string, ipfsHash: string) {
    return await this.contract.methods.registerContent(title, ipfsHash).send({ from: this.account });
  }

  // Fetch registered content
  async getContent(contentId: string) {
    return await this.contract.methods.getContentDetails(contentId).call();
  }

  // Transfer ownership of content
  async transferOwnership(contentId: string, newOwner: string) {
    return await this.contract.methods.transferOwnership(contentId, newOwner).send({ from: this.account });
  }
}
