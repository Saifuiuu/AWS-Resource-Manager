# AWS Resource Manager & FinOps Dashboard ☁️💸

A full-stack dashboard designed to solve two massive headaches for cloud developers: **silent cost leakage** and **accidental data exposure**.

## 🤔 Why I Built This (The Problem)
Let's be honest: the default AWS Console is powerful, but it's cluttered and overwhelming. Developers often spin up EC2 instances for testing, forget to shut them down, and wake up to a massive AWS bill at the end of the month. Furthermore, a single S3 bucket accidentally left "Public" can lead to a catastrophic data leak.

I wanted to build a simple, no-nonsense tool that tells me exactly where my money is going and whether my data is safe, without making me click through 15 different AWS menus.

## ✨ What It Does (The Solution)

- **💰 FinOps Cost Tracker:** Scans your AWS account via CloudWatch, identifies "Idle" EC2 instances (CPU < 5% over 24 hours), and calculates exactly how much money you are wasting.
- **🎮 Remote EC2 Control:** View all your EC2 instances across your region and Start/Stop them directly from this dashboard.
- **🔒 S3 Security Auditor:** Fetches all S3 buckets, calculates their exact size (using CloudWatch metrics to avoid API rate limits), and instantly flags any bucket that is exposed to the public.

## 🛠️ Tech Stack
- **Frontend:** React (powered by Vite), Tailwind CSS, Lucide React (for UI icons).
- **Backend:** Node.js, Express.js, RESTful APIs.
- **Cloud:** AWS SDK v3 (EC2, S3, CloudWatch clients).

---

## 🚀 How to Run It Locally

Want to test this out on your own AWS account? Here is the step-by-step process.

### Prerequisites
1. Node.js installed on your machine.
2. An AWS IAM User with an Access Key and Secret Key.
3. The IAM user must have these policies attached:
   - `AmazonEC2FullAccess` (to view, start, and stop instances)
   - `AmazonS3ReadOnlyAccess` (to audit buckets)
   - `CloudWatchReadOnlyAccess` (to fetch CPU and Size metrics)

### Step 1: Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
