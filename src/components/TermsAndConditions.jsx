// src/TermsAndConditions.js

import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 p-4 text-justify rounded-lg">
      <div className="bg-white text-gray-800 p-6  shadow-lg max-w-3xl w-full mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">
          Terms & Conditions
        </h1>
        <p className="mb-6">
          <strong>Effective Date:</strong> (Starting date)
        </p>
        <p className="mb-6">
          Before using the Play2Earn website (the “Service”), please carefully
          read these Terms of Use ("Terms"). These Terms govern the legal
          relationship between Play2Earn ("us", "our", or "we") and the
          individual ("you", "your", or "user") using the Play2Earn platform
          ("Platform") to receive payouts for completing various tasks. Your
          access to and use of the Service is subject to your acceptance of and
          compliance with these Terms, which apply to all visitors, users, and
          others who access or use the Service. If you do not understand any
          part of this Agreement, please contact us before using the Platform.
          If you do not agree to any of the terms, please refrain from using the
          Platform.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-4">
          1. THE PLATFORM
        </h2>
        <p className="mb-4">
          <strong>Platform Purpose:</strong> Play2Earn ("Play2Earn", "us",
          "our", or "we") is designed to enable you to complete various tasks
          and receive payouts for your efforts ("Payouts"). When you complete a
          task through the Platform, we resell it to our partners.
        </p>
        <p className="mb-4">
          The Platform’s functionality includes:
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>
              Allowing you to complete tasks within the Platform to earn
              rewards.
            </li>
            <li>
              Displaying the amount of earnings you have accumulated within the
              Platform, as well as the current value of Play2Earn tokens (P2E).
            </li>
            <li>
              Enabling you to request a Payout to receive your earnings in the
              form of P2E tokens to a connected crypto wallet.
            </li>
          </ul>
        </p>
        <p className="mb-4">
          <strong>Play2Earn Token (P2E):</strong> The cryptocurrency used to
          issue Payouts for your earnings through the Platform. All Payouts you
          receive via the Platform will be in P2E Tokens and sent to the crypto
          wallet you have connected with the Platform.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-4">
          2. THIRD-PARTY APPLICATIONS AND SURVEYS
        </h2>
        <p className="mb-4">
          While using the Play2Earn Platform, you may encounter opportunities to
          access and utilize applications or surveys provided by third parties
          to earn rewards. Your participation in these third-party applications
          or surveys is entirely at your own discretion and risk.
        </p>
        <p className="mb-4">
          Play2Earn is not responsible or liable for the availability, accuracy,
          content, requested permissions, products, or outcomes resulting from
          your use of these third-party applications or surveys. We do not
          guarantee that participation in these applications or surveys will
          always result in the earnings described within the Platform,
          especially in cases where device permissions are required for the
          third-party application.
        </p>
        <p className="mb-4">
          We strongly recommend that you familiarize yourself with any terms and
          conditions that may apply to your access or use of these third-party
          applications or surveys before participating.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-4">
          3. ACCOUNT
        </h2>
        <p className="mb-4">
          <strong>Signing Up:</strong> To start using the Play2Earn Platform,
          you must first sign in using one of the supported crypto wallets. You
          can do this in the following way:
          <ol className="list-decimal list-inside ml-4 mt-2">
            <li>
              Select a Supported Wallet: Choose from the list of crypto wallets
              compatible with the Platform.
            </li>
            <li>
              Connect Your Wallet: Follow the prompts to securely connect your
              wallet to the Platform.
            </li>
            <li>
              Authorize Access: Grant the necessary permissions to allow the
              Platform to interact with your wallet.
            </li>
            <li>
              Complete Registration: Once your wallet is connected, follow the
              on-screen instructions to complete the registration process.
            </li>
          </ol>
        </p>
        <p className="mb-4">
          <strong>Security:</strong> Maintaining the security of your Play2Earn
          account is your responsibility. This includes safeguarding your
          account name (crypto wallet ID number), password, and monitoring all
          activities within your account. Play2Earn is not liable for any losses
          or damages arising from unauthorized access or use of your account.
        </p>
        <p className="mb-4">
          If you suspect or become aware of any unauthorized use or access to
          your account, please notify us immediately so we can take appropriate
          action.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-4">
          4. BALANCE AND PAYOUTS
        </h2>
        <p className="mb-4">
          <strong>Balance:</strong> Your earnings will always be shown on the
          Platform in their equivalent value of P2E Tokens. This does not mean
          you own the P2E Tokens until you request a Payout. When you click the
          "Transfer to My Wallet" button, we will transfer P2E Tokens equivalent
          to the value of your earnings at that time.
        </p>
        <p className="mb-4">
          <strong>Payout:</strong> You can request a Payout up to the value of
          your earnings by clicking the “Transfer to My Wallet” button. P2E
          Tokens will be transferred to the crypto wallet connected to your
          account.
        </p>
        <p className="mb-4">
          <strong>Gas Fee:</strong> Each Payout request incurs a blockchain
          transaction fee ("Gas Fee"). This fee will be deducted from your
          Payout and displayed during the request process. While there are no
          minimum earnings requirements to request a Payout, the transaction
          value must cover the Gas Fee.
        </p>
        <p className="mb-4">
          <strong>Gas Fee Rate:</strong> The displayed Gas Fee may vary slightly
          from the actual amount deducted due to fluctuations in blockchain
          transaction fees.
        </p>
        <p className="mb-4">
          <strong>Risks:</strong> P2E Tokens, like any cryptocurrency, offers
          benefits but also comes with certain risks. These risks may include
          fluctuations in the value of P2E Tokens or limitations on its use and
          liquidity. As the Platform provides Payouts in P2E Tokens, we
          encourage you to carefully consider and understand these risks to
          ensure they align with your personal circumstances and goals before
          using the Platform.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-4">
          5. TERM AND TERMINATION
        </h2>
        <p className="mb-4">
          <strong>Term:</strong> This Agreement takes effect when you first
          access or use the Platform and remains in effect until terminated by
          either you or us.
        </p>
        <p className="mb-4">
          <strong>Termination by Us:</strong> We may terminate this Agreement
          and suspend or delete your Platform account at our sole discretion if:
          <ol className="list-decimal list-inside ml-4 mt-2">
            <li>
              We believe you are violating any applicable laws, including
              fraudulent actions;
            </li>
            <li>You breach any terms of this Agreement;</li>
            <li>
              We reasonably believe your actions could harm our infrastructure
              or reputation;
            </li>
            <li>We are directed to do so by competent authorities.</li>
          </ol>
        </p>
        <p className="mb-4">
          If we terminate the Agreement, we may, unless otherwise required by
          law or due to fraudulent actions, transfer any remaining P2E Tokens in
          your account to your connected crypto wallet.
        </p>
        <p className="mb-4">
          <strong>Inactivity:</strong> If your Platform account remains
          inactive, meaning no activity has been recorded for more than six (6)
          months, it may expire, and all P2E Tokens in the account will be
          deemed invalid and forfeited. An account is considered inactive if
          there has been no login event registered by our infrastructure in the
          past six months.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-4">
          6. INTELLECTUAL PROPERTY
        </h2>
        <p className="mb-4">
          Play2Earn grants you a revocable, non-exclusive, non-sublicensable,
          non-transferable, royalty-free limited license to access and use the
          Platform in accordance with the terms of this Agreement.
        </p>
        <p className="mb-4">
          You acknowledge and agree that the “Play2Earn” name, the Platform, all
          related logos, our website, and any accompanying materials, systems,
          programs, processes, texts, designs, trademarks, or other intellectual
          property (“Intellectual Property”) are owned by Play2Earn and its
          licensors and are protected under intellectual property laws and
          regulations. You may not copy, imitate, modify, or use them without
          our prior written consent. Additionally, you agree not to register
          trademarks, trade names, logos, or similar objects that incorporate or
          resemble the Play2Earn name or its modifications for any related
          activities, including cryptocurrency, software,
          internet/communication, proxy services, data collection, or similar
          goods and services.
        </p>
        <p className="mb-4">
          This Agreement does not grant you any rights or interest in
          Play2Earn’s Intellectual Property beyond those expressly granted. All
          rights to Play2Earn’s Intellectual Property not expressly granted to
          you remain reserved.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-4">
          7. OTHER PROVISIONS
        </h2>
        <p className="mb-4">
          <strong>Amending the Agreement:</strong> We may amend this Agreement
          at any time in our sole discretion. Any amended Agreement shall be
          posted on our website. Any amendment to the Agreement shall be
          effective to you immediately upon its posting on our website and shall
          apply to any use of the Platform by you from that point forward.
          Should you disagree with any such amended terms of the Agreement, you
          should immediately terminate your account and cease using the
          Platform.
        </p>

        <h2 className="text-2xl font-semibold text-blue-600 mt-6 mb-4">
          8. CONTACT US
        </h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at{" "}
          <a
            href="mailto:privacy@play2earn.io"
            className="text-blue-600 underline"
          >
            privacy@play2earn.io
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
