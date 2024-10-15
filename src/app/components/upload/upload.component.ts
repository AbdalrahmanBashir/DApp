import { Component } from '@angular/core';
import { Web3Service } from '../../Services/web3.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  title: string = '';
  file: File | null = null;
  ipfsHash: string | null = null;

  constructor(private web3Service: Web3Service) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  async onSubmit() {
    if (this.file && this.title) {
      try {
        // Upload file to IPFS
        this.ipfsHash = await this.web3Service.uploadToIPFS(this.file);
        console.log('Uploaded to IPFS:', this.ipfsHash);

        // Register content on the blockchain
        const result = await this.web3Service.registerContent(this.title, this.ipfsHash);
        console.log('Content registered:', result);
      } catch (error) {
        console.error('Error uploading or registering content:', error);
      }
    }
  }
}
