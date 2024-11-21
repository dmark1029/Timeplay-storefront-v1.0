const PRIVACY_NOTICE_URL = "https://www.carnival.com/about-carnival/legal-notice/privacy-notice";

type TermsConditionsProps = {
  maxHeight?: boolean;
};

const TermsConditions: React.FC<TermsConditionsProps> = ({ maxHeight }) => {
  return (
    <div
      className={`${
        maxHeight ? 'h-max' : 'h-96'
      } scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-200 mt-2 flex w-full flex-col overflow-auto rounded-lg bg-white px-4 py-2`}
    >
      <div className='relative z-0 flex flex-col justify-between gap-4 pt-4'>
        <h3 className='text-center text-lg font-bold tracking-tight'>
          TIMEPLAY App Terms of Service ("Terms of Service" or "Terms"):
        </h3>
        <span className='text-center text-lg font-bold tracking-tight'>
          IMPORTANT NOTICE: These Terms of Service have been updated as of 7/08/24.
        </span>
        <span className='text-md text-center font-bold tracking-tight'>
          PLEASE NOTE THAT THESE TERMS OF SERVICE INCLUDE A MANDATORY ARBITRATION PROVISION WHICH
          REQUIRES THAT ANY PAST, PENDING, OR FUTURE DISPUTES BETWEEN YOU AND US SHALL BE RESOLVED
          BY FINAL AND BINDING ARBITRATION ON AN INDIVIDUAL AND NOT A CLASS-WIDE OR CONSOLIDATED
          BASIS. IF YOU DO NOT WISH TO BE SUBJECT TO ARBITRATION ON A RETROACTIVE BASIS AND AS TO
          ANY FUTURE CLAIMS [AND YOU HAVE NOT PREVIOUSLY AGREED TO AN ARBITRATION PROVISION IN
          CONNECTION WITH YOUR USE OF OUR SERVICES], YOU MAY OPT OUT OF THE ARBITRATION PROVISION
          WITHIN THIRTY (30) DAYS BY FOLLOWING THE INSTRUCTIONS PROVIDED AT THE END OF THE SECTION
          TITLED "NOTICES/COMPLAINTS/DISPUTES."
        </span>
        <span className='text-md text-center font-bold tracking-tight'>
          Note: Please read through the Terms of Service and accept in order to use the TIMEPLAY
          Powered App.
        </span>
        <span className='pb-4 font-medium'>
          PLEASE READ THESE TERMS OF SERVICE CAREFULLY TOGETHER WITH EACH OF THE DOCUMENTS
          REFERENCED IN SECTION 1.2 BELOW (THESE TERMS OF SERVICE TOGETHER WITH EACH OF THE
          DOCUMENTS REFERENCED IN SECTION 1.2 BELOW ARE COLLECTIVELY REFERRED TO HEREIN AS THE <strong>"AGREEMENTS"</strong>).
          BY ACCEPTING THESE TERMS OF SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ AND
          ACCEPT THE AGREEMENTS WITHOUT MODIFICATION. IF YOU DO NOT ACCEPT THE AGREEMENTS WITHOUT
          MODIFICATION, DO NOT ACCEPT THESE TERMS OF SERVICE AND DO NOT ACCESS OR USE THE TP POWERED
          APP (AS DEFINED BELOW). THE AGREEMENTS ARE SUBJECT TO CHANGE AT ANY TIME IN ACCORDANCE
          WITH SECTION 17 BELOW.
        </span>
        <span className='pb-4 font-medium'>
          If you have any questions about the Agreements, please seek independent legal counsel
          before accepting these Terms of Service or accessing or using the TP Powered App as
          offered by Carnival Corporation.
        </span>
        <span className='pb-4 font-medium'>
          The Agreements apply to the TIMEPLAY Powered Mobile Digital Lottery and Instant Win Games
          App (the <strong>"TP Powered App" or the "Services"</strong>) provided by Carnival Corporation, 3655
          NW 87th Ave., Miami, FL 33178 ( <strong>"CARNIVAL," "we," "our"</strong> or <strong>"us"</strong> ) and is a
          legally binding contract between us and anyone who accesses or uses the TP Powered App ({' '}
          <strong>"you"</strong> or <strong>"your"</strong> ). As used in the Agreements, the word "including" means
          including, without limitation.
        </span>
        <h4><strong>1. APPLICABILITY OF AGREEMENTS</strong></h4>
        <p className="block pb-4">
          1.1. The TP Powered App is offered subject to your acceptance of the Agreements without
          any modifications by you. After you acknowledge/accept these Terms of Service, the
          Agreements will constitute a legally binding contract between you and us. By
          downloading, installing, accessing, or using the TP Powered App, you agree to be
          bound by all of the Terms of Service of the Agreements as such Agreements may be
          amended by us from time-to-time in our sole and complete discretion in accordance
          with Section 17 hereof. Please check the Agreements periodically for any amendments.
          You acknowledge that your failure to comply with these Agreements may result in
          disqualification, the closure of your Account, forfeiture of funds and/or legal
          action against you, as appropriate and as further specified in these Agreements.
          Your continued access or use of the TP Powered App following any amendments to the
          Agreements constitutes your acceptance of the Agreements as amended.
        </p>
        <p className="block pb-4">
          1.2. The Agreements include the following documents, which you should read carefully
          because they are part of a legally binding contract between you and CARNIVAL: (a)
          these Terms of Service; (b) CARNIVAL's <a href={PRIVACY_NOTICE_URL} className="text-blue-800 font-bold underline" target="_blank">Privacy Policy</a>; (c) CARNIVAL's Casino House
          Rules; (d) Passenger Code of Conduct; and (e) any other documents associated to your
          CARNIVAL account. In the event of any discrepancy or conflict between these Terms
          and any other policies or rules presented in connection with the Services, these
          Terms shall expressly control.
        </p>
        <h4><strong>2. THIRD PARTY BENEFICIARY</strong></h4>
        <p className="block pb-4">
          2.1 TIMEPLAY is a third-party beneficiary to these Terms of Service and is entitled to
          all rights and benefits within this Agreement as if it were a party to the
          agreement, including but not limited to the provisions involving arbitration
          (Section 17). This Agreement may be enforced by TIMEPLAY to the extent necessary to
          protect its rights by and between anyone who uses or accesses the TP Powered App,
          regardless of whether TIMEPLAY is specifically referenced in the Sections of this
          Agreement that it is enforcing. Notwithstanding the foregoing, this Agreement shall
          not be modified or changed without the express written consent of CARNIVAL. Nothing
          in these Terms is intended to create, nor does it create, any contractual rights,
          duties or obligations among or between CARNIVAL and TIMEPLAY, nor does it establish
          or create, among or between CARNIVAL and TIMEPLAY, any ownership interests or
          responsibilities in or pertaining to the TP Powered App, or any other systems or
          software necessary for or related to the Services. Except as otherwise provided in
          this Agreement, no other person will have any right or obligation hereunder.
        </p>
        <h4><strong>3. AGE AND LOCATION RESTRICTIONS</strong></h4>
        <p className="block pb-4">
          3.1. While CARNIVAL’s cruise ships are in international waters (but not in domestic
          waters), you may use the TP Powered App if you are eighteen (18) years of age or
          older and otherwise legally able to use the TP Powered App under all applicable
          federal, state, and tribal laws, rules, regulations, orders, decrees, and ordinances
          (<strong>"Laws"</strong>). You are solely responsible for complying with applicable Laws.
        </p>
        <p className="block pb-4">
          3.2. In order to use the Gaming Services feature of the TP Powered App, you must be
          listed as an eligible passenger on the guest manifest, and physically located
          onboard an eligible Carnival ship in international waters or other jurisdictions
          where internet gaming is lawful.
        </p>
        <h4><strong>4. ACCOUNT AND SOURCE OF FUNDS</strong></h4>
        <p className="block pb-4">
          4.1. Funding used in the TP Powered App can be made via your casino Player Bank or via
          folio charge.
        </p>
        <p className="block pb-4">
          4.1.1. All money that you use originates from a payment source of which you are the
          legal owner;
        </p>
        <p className="block pb-4">
          4.1.2. All money that you use is free from and unconnected to any illegality and, in
          particular, does not originate from any illegal activity or source;
        </p>
        <p className="block pb-4">
          4.1.3. You accept that all transactions may be checked for the detection of money
          laundering and that any transactions made by you which we deem suspicious may be
          reported to the appropriate authorities.
        </p>
        <p className="block pb-4">
          4.2. Payment of winnings will be made when results are confirmed and posted. Any winnings
          will be applied directly to your Player Bank and may be redeemed directly at the
          casino cage. Deposits and withdrawals may be subject to review. In the case of
          suspected or fraudulent activity, we may suspend or terminate your account and may
          refund or refuse to refund any monies contained in your Carnival account in our sole
          and absolute discretion. You can request withdrawals from your Player Bank at any
          time provided all payments made have been received.
        </p>
        <p className="block pb-4">
          4.3. By accepting the Agreements, you acknowledge that winnings from your use of the TP
          Powered App may be subject to Internal Revenue Service ("IRS") reporting and
          withholding laws, and you permit your acceptance of the Agreements to serve as an
          electronic signature and to suffice as your acceptance and signature on any
          necessary tax documents associated with your use of the TP Powered App.
        </p>
        <p className="block pb-4">
          4.4. <strong>Important Information About Your Use of the TP Powered App.</strong> To help the
          government fight the funding of terrorism and money laundering activities, federal
          law requires us to obtain, verify, and record information that identifies each
          person who uses the TP Powered App. The name on your CARNIVAL account must match the
          name and date of birth which appears on the current government-issued photo
          identification you used to board the vessel. We reserve the right to request
          satisfactory proof of age and identity (including copies of government issued
          documents, such as a valid driver's license or other state ID) to be presented by
          you in person to a member of the CARNIVAL staff member onboard. You consent to have
          your age, identity and source of funds verified by us. Failure to supply any
          requested documentation may result in you being unable to use the TP Powered App.
        </p>
        <p className="block pb-4">
          4.5. You must keep your Player Bank PIN secret and confidential and not allow anyone else
          to use your CARNIVAL account. You are solely responsible for the security of your
          Player Bank PIN and all activities that occur under your CARNIVAL account name and
          password. All winnings that are won on the TP Powered App that meet reporting
          thresholds under applicable Laws will be reported to the IRS in the name of the
          CARNIVAL account holder. Information about your identity and transactions may be
          reported to government agencies as required by law. You must notify us immediately
          of any unauthorized use of your CARNIVAL account or any other breach of security
          that is known or suspected by you. You must also notify us immediately if you no
          longer have access to, or control of, the mobile device associated with your
          CARNIVAL account. In no event will we be liable for any loss you suffer as a result
          of any unauthorized use or misuse of your CARNIVAL account. If you lose or forget
          your Player Bank PIN, please contact the casino staff for assistance. You may be
          asked to provide information that we will use to confirm your identity in the event
          you submit a request for a lost or forgotten Player Bank PIN.
        </p>
        <p className="block pb-4">
          4.6. The information you provide in connection with your use of the TP Powered App,
          including the Location Services, will be collected, used and shared in accordance
          with our <a href={PRIVACY_NOTICE_URL} className="text-blue-800 underline" target="_blank"><strong>Privacy Policy</strong></a>.
        </p>
        <p className="block pb-4">
          4.7. The following persons (each an "<strong>Unauthorized Person</strong>" ) are not permitted to
          establish a CARNIVAL account or directly or indirectly use the TP Powered App other
          than as required in the course of their employment with CARNIVAL: (a) any
          individuals who have been banned from gaming activities at any CARNIVAL subsidiary
          or affiliate, or who have been prohibited from gaming pursuant to any applicable
          Laws, including individuals who have been "self-limited" or listed on any
          self-exclusion, disassociated persons, or similar list in any state; (b) employees
          of CARNIVAL or TIMEPLAY or its subsidiary or affiliated companies who have
          administrative or privileged access to the TP Powered App, including employees of
          TIMEPLAY’s suppliers or vendors; (c) "prohibited persons" that are government
          officials or residents of certain embargoed countries and/or whose names are
          included on the U.S. Treasury Department's list of Specially Designated Nationals or
          the U.S. Department of Commerce Denied Person's List or Entity List or successor or
          similar lists; or (d) persons who are under the age of 18. You may not use the TP
          Powered App if you are an Unauthorized Person or assist other Unauthorized Persons
          to use the TP Powered App.
        </p>
        <h4><strong>5. YOUR USE OF THE TP POWERED APP</strong></h4>
        <p className="block pb-4">
          5.1. We reserve the right to suspend, modify, remove or add to the TP Powered App in our
          sole and complete discretion with immediate effect and without notice or liability,
          so long as such a change does not affect pending play on the Services. We will not
          be liable for any such action.
        </p>
        <p className="block pb-4">
          5.2. We reserve the right, in our sole and complete discretion, for any reason or no
          reason to (a) refuse to accept all or part of any funds, (b) declare the system
          closed for receiving any or all funds, or (c) refuse, suspend, or terminate your use
          of the TP Powered App, or any games on or available through the TP Powered App.
        </p>
        <p className="block pb-4">
          5.3. Without limiting the foregoing Section 5.2, we may also reject any transactions that
          we know are placed by any Unauthorized Person, as defined in Section 4.7.
        </p>
        <p className="block pb-4">
          5.4. No communications or information published in the TP Powered App is intended to
          constitute legal or tax advice, and we accept no liability for any reliance on such
          communications or information. Your use of the TP Powered App (including, for the
          avoidance of doubt, any intellectual property or services we may license from third
          parties that are part of the TP Powered App) is strictly for your personal
          entertainment on a single device at any given time. You may not use the TP Powered
          App or any intellectual property associated therewith for any commercial purpose,
          including offering or promoting any products or services. You may not use the TP
          Powered App in violation of any applicable Laws or in any manner that impinges on
          the rights of others. You may not use the TP Powered App for activities we deem
          improper, including any of the following: (a) logging onto the TP Powered App with
          false or fraudulent information; (b) using the TP Powered App in any manner that is
          fraudulent, unlawful, harmful, threatening, abusive, harassing, tortious,
          defamatory, vulgar, obscene, invasive of another's privacy, or libellous; (c)
          infringing any third-party's intellectual property, rights of publicity or privacy,
          or other proprietary rights; (d) creating or transmitting software or programs
          designed to interrupt, interfere, intercept, expropriate, destroy or limit the
          functionality of the TP Powered App or any other computer software or hardware, such
          as viruses, worms, Trojan horses, time bombs, corrupted files, or spam; (e) removing
          any copyright, trademark or other proprietary rights notices contained in or on the
          TP Powered App; (f) attempting, through any means, to gain access to any
          unauthorized areas of the TP Powered App or information about other users of the TP
          Powered App or any of our customers for unauthorized purposes; (g) using any robot,
          scraper, spider, or any other automatic device or manual process to monitor or copy
          any content transmitted via the TP Powered App; (h) taking any action that creates
          liability for us or causes us to lose any of the services of our business partners,
          vendors or suppliers; and (i) taking any action that would cause us to violate any
          applicable Laws or that violates the Agreements.
        </p>
        <p className="block pb-4">
          5.5. You may not install or run the TP Powered App on any device which is rooted,
          jailbroken or whose operating system software, hardware (including, but not limited
          to, interface, display, geolocation and networking components) or firmware has been
          tampered with in any way. You may not install or attempt to install and run the TP
          Powered App inside any simulator or emulated software environment. You may not run
          or attempt to use the TP Powered App on any device which is connected to the
          internet through a proxy server, VPN or any other networking arrangement which may
          mask or attempt to mask the true location of the device. You may not run the TP
          Powered App on any device which has in any way been enhanced, augmented, or tampered
          with in such a way as to enable a person who is not physically located with the
          device from controlling it.
        </p>
        <p className="block pb-4">
          5.6. By using the TP Powered App you consent to us making a voice, print, electronic or
          other approved record of the entire transaction. Such communication will be recorded
          when you confirm the information. We will not accept any transaction if such
          recording system is inoperable. Upon your written request, we will provide to you a
          statement of your CARNIVAL account showing each account deposit, withdrawal, credit,
          and debit made during the time period reported by the account statement.
        </p>
        <p className="block pb-4">
          5.7. Taxes. You are solely responsible for filing and paying applicable state and federal
          taxes on any winnings. We do not provide tax advice, nor should any statements in
          these Terms or on the Services be construed as tax advice.
        </p>
        <h4><strong>6. ADDITIONAL TERMS FOR USE OF THE GAMING SERVICES</strong></h4>
        <p className="block pb-4">
          6.1. Real Money Games
          <br />
          <br />
          By registering for the Services, you will be able to access 'real money' games
          ("Real Money Games") through the TP Powered App. We reserve the right to suspend,
          modify, remove, or add any gaming service in our sole discretion with immediate
          effect and without notice and we will not be liable for any such action. Please note
          that in the event of any conflict between this Section 6.1 and the remaining
          Sections of these Terms of Service, the remaining Sections of these Terms of Service
          shall prevail.
        </p>
        <p className="block pb-4">
          6.2. Rules and Procedures of the Services
          <br />
          <br />
          You must use the Services in accordance with the generally accepted game rules set
          out in the Game Rules section, and these procedures relevant to the Gaming Services.
          You are using those rules and procedures specifically set out on the TP Powered App,
          Game Instructions & Rules section, and any other page that specifically relates to
          and governs any particular event or game ('House Rules').
        </p>
        <p className="block pb-4">
          6.3. Settlement of In-Game Disputes
          <br />
          <br />
          You fully accept and agree that random number generator ('RNG') software will
          determine randomly generated events required in the Gaming Services. If there is a
          discrepancy between the result showing on the Software (as installed and operated on
          your hardware) and our server, the result showing on our server shall govern the
          result. Moreover, you understand and agree that (without prejudice to your other
          rights and remedies) Our records shall be the final authority in determining the
          terms of your use of the Gaming Services, the activity resulting therefrom and the
          circumstances in which such activity occurred. Please note that in the event of any
          conflict between this Section 6.3 and the remaining Sections of these Terms of
          Service, the remaining Sections of these Terms of Service shall prevail.
        </p>
        <p>6.4. Unfair Advantage/Anti-Cheating Policy</p>
        <p className="block pb-4">
          6.4.1. Anti-Cheating Policy:
          <br />
          <br />
          We are committed to preventing the use of unfair practices in the Services,
          including, but not limited to, player collusion. We are also committed to
          detecting and preventing the use of software programs that are designed to
          enable artificial intelligence to play on our platforms including, but not
          limited to, opponent profiling, cheating software, automated computerized
          software or other equivalent mechanism, or anything else that enables you to
          have an unfair advantage over other players not using such programs or systems
          ('AI Software'). You acknowledge that we will take measures to detect and
          prevent the use of such programs and AI Software using methods (including, but
          not limited to, reading the list of currently running programs on a player's
          computer), and you agree not to use any AI Software or any such programs.
        </p>
        <p className="block pb-4">
          6.4.2. Extracting Player Profiles:
          <br />
          <br />
          Certain companies offer for-sale programs specifically created to extract player
          profiles and then sell them in the form of voluminous player databases, with the
          promise that anyone who purchases these programs can use this information to
          their advantage against other players, by invisibly gathering information about
          you and then selling it to others to use when they play against you online.
          These programs are based on player hand histories, and they typically use the
          following methods: screen-scraping and by accessing histories directly from an
          individual player's computer using the program. These programs are not permitted
          to be used in connection with the Services. CARNIVAL reserves the right to
          withhold funds of, and deny services to, any person using these programs, or any
          other prohibited tool or service.
        </p>
        <p className="block pb-4">
          6.4.3. The Use of Artificial Intelligence (AI):
          <br />
          <br />
          AI is composed of autonomous or command-executed programs on a computer or
          network that can interact with computer systems or users, especially one
          designed to respond or behave like a player. CARNIVAL prohibits the use of AI on
          its platform and across its skins. All player actions taken on the TP Powered
          App must be player-generated without assistance. CARNIVAL reserves the right to
          withhold funds of, and deny services to, any person using a prohibited tool or
          service.
        </p>
        <p className="block pb-4">
          6.4.4. The Use of 'BOTs":
          <br />
          <br />
          Certain companies offer BOTs specifically created to play a game in the place of
          an actual (human) player, and conceal its use from the other players, and avoid
          detection by the online gaming site. These programs are marketed by explicitly
          promising the prospective purchaser/user an unfair advantage over other online
          players not using that program. A bot is software that can interact with the TP
          Powered App without any human input. The software calculates the best available
          decision then executes. The use of BOTs is prohibited in connection with the
          Services. CARNIVAL reserves the right to withhold funds of, and deny services
          to, any person using these programs, or any other prohibited tool or service.
        </p>
        <p className="block pb-4">
          6.4.5. Real Time Assistance (RTA) tools:
          <br />
          <br />
          RTA tools that use software to suggest to an active player what action to take
          (i.e. 'bet' or 'check') are prohibited. CARNIVAL reserves the right to withhold
          funds of and deny services to any person using RTA tools, or any other
          prohibited tool or service.
        </p>
        <p>6.5. General Disconnection Policy</p>
        <p className="block pb-4">
          6.5.1. If a player becomes disconnected while involved in a game where no player input
          is required to complete the game, the game will produce the final outcome as
          determined by the random number generator. We will update the player's CARNIVAL
          account accordingly.
        </p>
        <p className="block pb-4">
          6.5.2. If a player becomes disconnected while involved in a single player game, where
          player input is required to complete the game, we will, subject to our sole
          discretion, either: (1) upon subsequent activation, return the player to the
          game state from immediately prior to the interruption and allow the player to
          complete the game; or (2) cancel the game according to the specific game's
          rules, resulting in either the forfeiture or the return of funds to the player
          in accordance with CARNIVAL'S internal procedures; or (3) depending on the
          specific game's rules, make a selection on behalf of the player in order to
          complete the game.
        </p>
        <p className="block pb-4">
          6.5.3. If a player becomes disconnected while involved in a game with multiple players,
          where the result is affected by the time to respond to a game event, the game
          shall make a selection on behalf of the player in order to complete the game.
        </p>
        <h4><strong>7. COPYRIGHT AND TRADEMARK</strong></h4>
        <p>
          The term TP Powered App and any other marks used by us are the trademarks, service
          marks and/or trade names of CARNIVAL, TIMEPLAY, and/or their subsidiaries, affiliates,
          and/or licensors of Carnival or TIMEPLAY. All other material used by us, including the
          software, images, pictures, graphics, photographs, animations, "look and feel,"
          videos, music, audio, text (and any intellectual property rights in and to any of the
          same) is owned by Carnival, TIMEPLAY, and/or the licensors of Carnival or TIMEPLAY and
          is protected by copyright and/or other intellectual property rights. You obtain no
          rights in such copyright material or trade or service marks and must not reproduce,
          republish, distribute, display, perform, transmit, sell or otherwise use them without
          our express written permission.
        </p>
        <h4><strong>8. COPYRIGHT NOTICE</strong></h4>
        <p>
          CARNIVAL and TIMEPLAY require users of the TP Powered App to respect the intellectual
          property rights of others. If you are the owner of copyright and you believe that your
          work has been used in the Services in a way that constitutes copyright infringement,
          please provide CARNIVAL'S Legal Department at{' '}
          <a
            href='mailto:cclegaldepartment@carnival.com'
            target='_blank'
            className='text-blue-800 underline'
          >
            cclegaldepartment@carnival.com
          </a>{' '}
          and TIMEPLAY at{' '}
          <a href='mailto:legal@timeplay.com' className='text-blue-800 underline'>
            legal@timeplay.com
          </a>{' '}
          with a notice meeting all of the requirements of the Digital Millennium Copyright Act
          ("DMCA"). Your notice should contain the following information:<br/><br/>
          <p className='pb-4'>
            1. a physical or electronic signature of the person authorized to act on behalf of
            the owner of the copyright or other intellectual property interest;
          </p>
          <p className='pb-4'>
            2. a clear description of the copyrighted work or other intellectual property that
            you claim has been infringed;
          </p>
          <p className='pb-4'>
            3. a description of where the material that you claim is infringing is located in the
            Services;
          </p>
          <p className='pb-4'>
            4. your address, telephone number, and email address;
          </p>
          <p className='pb-4'>
            5. a statement by you that you have a good faith belief that the disputed use is not
            authorized by the copyright owner, its agent, or the law; and
          </p>
          <p className='pb-4'>
            6. a statement by you, made under penalty of perjury, that the above information in
            your notice is accurate and that you are the copyright or intellectual property
            owner or authorized to act in the copyright or intellectual property owner's
            behalf.
          </p>
          Before you file your DMCA notice, please carefully consider whether or not the use of
          the copyrighted material at issue is protected by the Fair Use doctrine. If you file a
          DMCA notice when there is no infringing use, you could be liable for costs and
          attorneys' fees. Our agent for notice of claims of copyright or other intellectual
          property infringement can be reached as follows:{' '}
          <a
            href='mailto:cclegaldepartment@carnival.com'
            target='_blank'
            className='text-blue-800 underline'
          >
            cclegaldepartment@carnival.com
          </a>
        </p>
        <h4><strong>9. FRAUDULENT ACTIVITIES AND SECURITY REVIEW</strong></h4>
        <p className="block pb-4">
          9.1. We have a zero-tolerance policy towards inappropriate play, fraudulent activity and
          use of the TP Powered App to violate or attempt to violate any federal, state,
          tribal, or local law. If, in our sole determination, (a) you are found to have
          cheated or attempted to defraud us or any user of the TP Powered App in any way
          (including game, device, and TP Powered App software manipulation) or violated or
          attempted to violate any federal, state, tribal or local law; (b) we suspect you of
          fraudulent payment (including use of stolen debit, credit or prepaid cards) or any
          other fraudulent activity (including any chargeback or other reversal of a payment)
          or prohibited transaction (including money laundering); we reserve the right to
          suspend your use of the TP Powered App and recover bad debts using any lawful method
          available to us, including debiting the amount owed by you from your CARNIVAL
          account and instructing third-party collections agencies to collect the debt. You
          acknowledge that these actions may have a detrimental impact on your credit rating
          and may require us to share your personal information (including your identity) with
          appropriate agencies and to report any criminal or suspicious activities to the
          appropriate authorities.
        </p>
        <p className="block pb-4">
          9.2. We reserve the right to void and withhold any or all winnings made by any person or
          group of persons gained by any person or group of persons where we have reasonable
          grounds to believe, in our sole discretion, that said person or group of persons is
          acting or has acted in liaison in an attempt to defraud or damage us or the TP
          Powered App in any way.
        </p>
        <p className="block pb-4">
          9.3. We reserve the right to conduct a security review at any time to validate or verify
          your identity, age, registration data, integrity of your mobile device(s) and use of
          the TP Powered App on such device(s), compliance with the Agreements, and compliance
          with applicable Laws. In the event of such a security review, you agree to provide
          us with the information and documentation we request and authorize us and our agents
          to use and disclose to any third-party that we deem necessary the information and
          documentation that you provide to us, including ordering a credit report or
          otherwise verifying your information against third-party databases. In addition, to
          facilitate these Security Reviews, you agree to provide any information or
          documentation that Carnival, in our unfettered discretion, may request.
        </p>
        <p className="block pb-4">
          9.4. In the interests of data protection, security, and avoidance of fraud, Carnival does
          not permit the use of any communication channels included within the Services or the
          platforms to offer or promote any offers, products, and services (whether yours or a
          third party's).
        </p>
        <h4><strong>10. LIMITED LICENSE</strong></h4>
        <p className="block pb-4">
          10.1. We hereby grant you a limited, personal, non-exclusive, non-transferable,
          non-assignable, nonsublicensable, revocable right to install and use the software we
          make available for the TP Powered App (the <strong>"Software"</strong>) in accordance with the
          Agreements. The Software is valuable intellectual property of CARNIVAL, and/or its
          licensors. You obtain no rights to the Software except to use it in accordance with
          the Agreements. You must not: (a) copy, redistribute, publish, reverse engineer,
          decompile, disassemble, modify, translate or make any attempt to access the source
          code to create derivate works of the source code, or otherwise; (b) sell, assign,
          sublicense, transfer, distribute, lease or grant a security interest in the
          Software; (c) make the Software available to any third-party through a computer
          network or otherwise; (d) export the Software to any country (whether by physical or
          electronic means); (e) reproduce, duplicate, copy, sell, resell or exploit for any
          commercial purposes any portion of the TP Powered App or the Software; or (f) use
          the Software in a manner prohibited by applicable Laws or the terms of the
          Agreements (together the <strong>"Prohibited Activities"</strong>).
        </p>
        <p className="block pb-4">
          10.2. You will be solely liable for any damages, costs or expenses arising out of or
          relating to the commission of any Prohibited Activities. You shall notify us
          immediately upon becoming aware of the commission by any person of any of the
          Prohibited Activities and shall provide us with reasonable assistance with any
          investigations we may conduct as a result.
        </p>
        <h4><strong>11. FORFEITURE</strong></h4>
        <p>
          We reserve the right, in our sole discretion, and in relation to your use of the TP
          Powered App, to terminate the Agreements, withhold your CARNIVAL account balance, and
          recover from your CARNIVAL account the amount of any affected pay-outs, bonuses and
          winnings if:
        </p>
        <p>
          - You are in material breach of the Agreements;
        </p>
        <p>
          - We become aware that you have used or attempted to use the TP Powered App for the
          purposes of fraud, collusion (including in relation to chargebacks) or unlawful or
          improper activity;
        </p>
        <p>
          - We become aware that you have played at any other online gaming site or services and
          are suspected of fraud, collusion (including in relation to chargebacks) or unlawful
          or improper activity;
        </p>
        <p>
          - You have "charged-back" or denied any of the purchases or deposits that you made to
          your Player Bank;
        </p>
        <p>
          - You file for bankruptcy or similar proceedings; or
        </p>
        <p>
          - We are instructed to do so by a law enforcement agency or regulatory body.
        </p>
        <h4><strong>12. TERMINATION</strong></h4>
        <p className="block pb-4">
          12.1. If you want us to terminate your use of the TP Powered App for responsible gaming
          reasons, please notify us pursuant to Section 17 hereof.
        </p>
        <p className="block pb-4">
          12.2. If we terminate your use of the TP Powered App pursuant to Section 12 hereof, any
          non-cashable promotional credits in your TP Powered App are non-refundable and
          deemed forfeited.
        </p>
        <p className="block pb-4">
          12.3. Any provisions which, by their nature or express terms should survive shall survive
          termination of the Agreements by either party.
        </p>
        <h4><strong>13. REPRESENTATIONS AND WARRANTIES</strong></h4>
        <p>
          By accessing the TP Powered App and the Software, or using, or attempting to use, the
          TP Powered App or the Software, you represent and warrant to us that: (a) you are 18
          years of age or older; (b) you will be located onboard an eligible Carnival ship in
          international waters or other jurisdictions where gaming onboard is lawful; (c) you
          are an eligible passenger on the ship's manifest and (d) all details provided by you
          to us to setup your CARNVIAL account or otherwise use the TP Powered App are true,
          current, correct and complete.
        </p>
        <h4><strong>14. LIMITATION OF LIABILITY</strong></h4>
        <p className="block pb-4">
          14.1. BY ACCESSING, USING OR DOWNLOADING THE SERVICES, YOU ACKNOWLEDGE AND AGREE THAT SUCH
          USE IS AT YOUR OWN RISK AND THAT NONE OF THE PARTIES INVOLVED IN CREATING,
          PRODUCING, OR DELIVERING THE SERVICES, NOR CARNIVAL OR TIMEPLAY, NOR OUR PARENT
          COMPANIES, SUBSIDIARIES, OR AFFILIATES (INCLUDING ANY OF OUR OR THEIR RESPECTIVE
          OFFICERS, DIRECTORS, SHAREHOLDERS, EMPLOYEES, AGENTS OR REPRESENTATIVES, OR THEIR
          RESPECTIVE SUCCESSORS AND ASSIGNS) (COLLECTIVELY, <strong>“RELEASED PARTIES”</strong>) ARE
          LIABLE IN CONTRACT, TORT OR OTHERWISE FOR ANY DIRECT, INCIDENTAL, CONSEQUENTIAL,
          INDIRECT, SPECIAL, OR PUNITIVE DAMAGES, OR ANY OTHER LOSSES, COSTS, OR EXPENSES OF
          ANY KIND (INCLUDING, WITHOUT LIMITATION, LOST PROFITS, LOSS OF DATA, LEGAL FEES,
          EXPERT FEES, COST OF PROCURING SUBSTITUTE SERVICES, LOST OPPORTUNITY, OR OTHER
          DISBURSEMENTS) WHICH MAY ARISE, DIRECTLY OR INDIRECTLY, THROUGH THE ACCESS TO, USE
          OF, RELIANCE ON ANY MATERIAL OR CONTENT ON THE SERVICES, OR BROWSING OF THE SERVICES
          OR THROUGH YOUR DOWNLOADING OF ANY MATERIALS, DATA, TEXT, IMAGES, VIDEO OR AUDIO
          FROM THE SERVICES, EVEN IF THE RELEASED PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY
          OF SUCH DAMAGES. TO THE MAXIMUM EXTENT PERMISSIBLE UNDER APPLICABLE LAWS, THE TOTAL
          LIABILITY OF THE RELEASED PARTIES IS LIMITED TO THE TOTAL AMOUNT YOU HAVE PAID THE
          RELEASED PARTIES IN THE ONE HUNDRED AND EIGHTY (180) DAYS IMMEDIATELY PRECEDING THE
          DATE ON WHICH YOU FIRST ASSERT ANY SUCH CLAIM. WITHOUT LIMITING THE FOREGOING,
          RELEASED PARTIES ASSUME NO RESPONSIBILITY, AND WILL NOT BE LIABLE, FOR ANY DAMAGES
          RELATING TO OR CAUSED BY ANY VIRUSES, BUGS, HUMAN ACTION OR INACTION OF ANY COMPUTER
          SYSTEM, PHONE LINE, HARDWARE, SOFTWARE OR PROGRAM MALFUNCTIONS, OR ANY OTHER ERRORS,
          FAILURES OR DELAYS IN COMPUTER TRANSMISSIONS OR NETWORK CONNECTIONS ON ACCOUNT OF
          YOUR ACCESS TO OR USE OF THE SERVICES. RELEASED PARTIES CANNOT AND DO NOT GUARANTEE
          CONTINUOUS, UNINTERRUPTED, OR SECURE ACCESS TO THE SERVICES.
        </p>
        <p className="block pb-4">
          14.2. DISCLAIMER OF WARRANTIES: THE SERVICES, IN WHOLE AND IN PART (INCLUDING, WITHOUT
          LIMITATION, ALL CONTENT, AND USER MATERIALS), ARE PROVIDED, TRANSMITTED,
          DISTRIBUTED, AND MADE AVAILABLE "AS IS" AND “AS AVAILABLE” WITHOUT EXPRESS OR
          IMPLIED WARRANTIES OF ANY KIND, INCLUDING, WITHOUT LIMITATION, WARRANTIES OF TITLE,
          IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE OR
          NON-INFRINGEMENT. WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE RELEASED
          PARTIES MAKE NO WARRANTY: (A) THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR FREE;
          (B) THAT DEFECTS OR ERRORS IN THE SERVICES WILL BE CORRECTED; (C) THAT THE SERVICES
          WILL BE FREE FROM VIRUSES OR OTHER HARMFUL COMPONENTS; (D) AS TO THE QUALITY,
          ACCURACY, COMPLETENESS AND VALIDITY OF ANY INFORMATION OR MATERIALS IN CONNECTION
          WITH THE SERVICES; (E) THAT YOUR USE OF THE SERVICES WILL MEET YOUR REQUIREMENTS; OR
          (F) THAT TRANSMISSIONS OR DATA WILL BE SECURE.
        </p>
        <p className="block pb-4">
          14.3. EXCEPTIONS: SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER, EXCLUSION OR LIMITATION
          OF CERTAIN WARRANTIES, LIABILITIES AND DAMAGES, SO SOME OF THE ABOVE DISCLAIMERS,
          EXCLUSIONS AND LIMITATIONS MAY NOT APPLY TO YOU. IN SUCH JURISDICTIONS, THE RELEASED
          PARTIES'WARRANTIES AND LIABILITY WILL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY
          APPLICABLE LAW. IN ANY EVENT, YOU AGREE THAT OUR TOTAL LIABILITY FOR DAMAGES,
          REGARDLESS OF THE FORM OF ACTION, SHALL NOT EXCEED ONE THOUSAND DOLLARS ($1000.00).
          THIS LIMITATION OF LIABILITY IS CUMULATIVE AND NOT PER INCIDENT. THE FOREGOING
          LIMITATIONS IN THIS SECTION WILL APPLY EVEN IF THE ABOVE-STATED REMEDY FAILS OF ITS
          ESSENTIAL PURPOSE.
        </p>
        <h4><strong>15. INDEMNIFICATION</strong></h4>
        <p>
          You agree to indemnify, defend, hold harmless and release the Released Parties from
          and against any claim, demand, damage, cost or expense, including reasonable
          attorneys' fees, made by any third-party arising from or relating to your (a) access
          to, use of, attempted access to or use of or inability to access or use the TP Powered
          App or the Software, (b) violation of the Agreements, or (c) infringement of any
          intellectual property or other right of any other person or entity.
        </p>
        <h4><strong>16. THIRD PARTY WEBSITES</strong></h4>
        <p>
          Any links on the TP Powered App to third-party websites or resources should not be
          interpreted as endorsement or approval by us of the organizations sponsoring these
          sites or their products or services. We make no representations or warranties, express
          or implied, with respect to the information provided on any third-party website or
          resource which may be accessed by a link from the TP Powered App, including any
          representations or warranties as to accuracy or completeness. You acknowledge and
          agree that we shall not be responsible or liable, directly or indirectly, for any
          damage or loss caused or alleged to be caused in connection with your use or reliance
          on any such content, information, goods, or services available on or through any such
          site or resource.
        </p>
        <h4><strong>17. NOTICES/COMPLAINTS/DISPUTES</strong></h4>
        <p className="block pb-4">
          17.1. If you have any complaints, claims, or disputes regarding any use or outcome from
          using the TP Powered App or any other activity, you must notify the Carnival
          shipboard casino manager as soon as is reasonably practicable following the date of
          the original transaction to which the claim or dispute refers.
        </p>
        <p className="block pb-4">
          17.2. Binding Arbitration and Class Waiver. PLEASE READ THESE "BINDING ARBITRATION" AND
          "CLASS WAIVER" PROVISIONS CAREFULLY, BECAUSE THEY REQUIRE YOU TO ARBITRATE ALL
          DISPUTES WITH THE RELEASED PARTIES AND LIMIT THE MANNER IN WHICH YOU CAN SEEK
          RELIEF. THIS PROVISION APPLIES TO ANY CLAIMS YOU MAY CURRENTLY POSSESS AND ANY
          CLAIMS YOU MAY RAISE IN THE FUTURE. WHILE YOU MUST AGREE TO THESE TERMS OF USE IN
          ORDER TO USE THE SERVICES, [IF YOU HAVE NOT PREVIOUSLY AGREED TO AN ARBITRATION
          PROVISION IN CONNECTION WITH YOUR USE OF OUR SERVICE] THERE IS AN OPTION, DESCRIBED
          BELOW, TO OPT OUT OF THE ARBITRATION AND CLASS WAIVER PROVISIONS. THE OPTION TO
          OPT-OUT IS TIME-LIMITED TO THIRTY (30) DAYS AND REQUIRES YOUR IMMEDIATE ATTENTION.{' '}
          <strong>
            THESE PROVISIONS GENERALLY PRECLUDE YOU FROM BRINGING ANY CLASS, COLLECTIVE, OR
            REPRESENTATIVE ACTION AGAINST THE RELEASED PARTIES. THEY ALSO PRECLUDE YOU FROM
            PARTICIPATING IN OR RECOVERING RELIEF UNDER ANY PAST, PENDING, OR FUTURE CLASS,
            COLLECTIVE, OR REPRESENTATIVE ACTION AGAINST THE RELEASED PARTIES BY SOMEONE ELSE.
            ARBITRATION PRECLUDES YOU FROM SUING IN COURT OR FROM HAVING A JURY TRIAL.
          </strong>
        </p>
        <p className="block pb-4">
          17.3. Scope of Arbitration Provision. You and the Released Parties agree that any past,
          pending, or future dispute, claim or controversy arising out of or relating to your
          access to or use of any part of the TP Powered App or to these Terms of Use
          (including without limitation any dispute concerning the breach, enforcement,
          construction, validity, interpretation, enforceability, or arbitrability of these
          Terms of Use) (a "Dispute"), shall be determined by arbitration, including claims
          that arose before acceptance of any version of these Terms containing an arbitration
          provision, except that you and the Released Parties are NOT required to arbitrate
          any Dispute in which either party seeks equitable and other relief for the alleged
          unlawful use of copyrights, trademarks, trade names, logos, trade secrets, or
          patents. In addition, in the event any dispute relating to the Terms of
          Use—including validity, interpretation, enforceability, or arbitrability—is to be
          determined pursuant to the Arbitration Provisions of these Terms, you and the
          Released Parties agree that the arbitrator exclusively shall have the power to rule
          on his or her own jurisdiction over the Dispute, including any objections with
          respect to the existence, scope or validity of the arbitration agreement or to the
          arbitrability of the claims or counterclaims presented as part of the Dispute.
        </p>
        <p className="block pb-4">
          17.4. The parties acknowledge that the agreement in this Section to arbitrate any Disputes
          on an individual and case-by-case basis is a separate agreement for purposes of the
          Federal Arbitration Act in addition to the Terms. The alleged invalidity of the
          Terms of Use shall have no effect upon the validity of our mutual agreement to
          arbitrate any Disputes under this Section. In addition, if any portion of this
          section entitled "NOTICES/COMPLAINTS/DISPUTES" is determined by a court to be
          inapplicable or invalid, then the remainder shall still be given full force and
          effect consistent with Section 20 of these Terms.
        </p>
        <p className="block pb-4">
          17.5. Waiver of Class Relief. Whether the Dispute is heard in arbitration or in court, you
          agree that you and the Released Parties will not commence against the other a class
          action, class arbitration, mass action or other representative action or proceeding,
          and shall not otherwise participate in such actions. You and the Released Parties
          are each waiving respective rights to participate in a class action. By accepting
          this agreement, you give up your right to participate in any past, pending, or
          future class action or any other consolidated or representative proceeding,
          including any existing as of the date you agreed to these Terms.
        </p>
        <p className="block pb-4">
          17.6. Whether to agree to arbitration is an important decision. It is your decision to
          make, and you are not required to rely solely on the information provided in these
          Terms. You should take reasonable steps to conduct further research and to consult
          with counsel (at your expense) regarding the consequences of your decision.
        </p>
        <p className="block pb-4">
          17.7. OPTION TO OPT OUT. [IF YOU HAVE NOT PREVIOUSLY AGREED TO AN ARBITRATION PROVISION IN
          CONNECTION WITH YOUR USE OF OUR SERVICE], YOU MAY OPT OUT OF THESE ARBITRATION AND
          CLASS ACTION PROVISIONS BY FOLLOWING THE INSTRUCTIONS BELOW. IF YOU DO NOT OPT-OUT,
          THESE TERMS WILL APPLY RETROACTIVELY TO ALL CLAIMS YOU MAY POSSESS, WHETHER ASSERTED
          TO DATE OR NOT.
        </p>
        <p className="block pb-4">
          17.8. PROCEDURE TO OPT OUT OF ARBITRATION. IF YOU DO NOT WISH TO AGREE TO THIS ARBITRATION
          AND CLASS ACTION WAIVER AGREEMENT [AND YOU HAVE NOT PREVIOUSLY AGREED TO AN
          ARBITRATION PROVISION IN CONNECTION WITH YOUR USE OF OUR SERVICE], YOU MUST, WITHIN
          THIRTY (30) DAYS OF ENTERING THIS AGREEMENT, SEND AN E-MAIL FROM THE EMAIL ADDRESS
          ASSOCIATED WITH YOUR ACCOUNT TO{' '}
          <a
            href='mailto:cclegaldepartment@carnival.com'
            target='_blank'
            className='text-blue-800 underline'
          >
            cclegaldepartment@carnival.com
          </a>{' '}
          CONTAINING YOUR FULL NAME, ADDRESS, AND THE WORDS "OPT OUT" IN THE BODY OR SUBJECT
          LINE OF THE EMAIL. ***EMAILS SENT TO OPT-OUT AFTER THE 30 DAY PERIOD SHALL NOT BE
          EFFECTIVE.***
        </p>
        <p className="block pb-4">
          17.9. Location of Arbitration and Applicable Rules. You and the Released Parties agree
          that such arbitration shall occur in Florida. You may request to appear in such
          proceedings telephonically. You and the Released Parties agree that such arbitration
          shall be conducted by a single arbitrator in accordance with the Commercial Rules of
          the American Arbitration Association ("AAA"), as modified by these Terms of Service.
        </p>
        <p className="block pb-4">
          17.10. Authority of Arbitrator. With the exception of class procedures and remedies as
          discussed above under "Waiver of Class Relief," the arbitrator shall have the
          authority to grant any remedy that would otherwise be available in court.
        </p>
        <p className="block pb-4">
          17.11. Confidentiality. You and the Released Parties shall maintain the confidential nature
          of the arbitration proceedings and the arbitration award, including the arbitration
          hearing, except as may be necessary to prepare for or conduct the arbitration
          hearing on the merits, or except as may be necessary in connection with a court
          application for a preliminary remedy, a judicial challenge to an award or its
          enforcement, or unless otherwise required by law or judicial decision.
        </p>
        <p className="block pb-4">
          17.12. Allocation of Arbitration Fees. If you assert a Dispute as an individual, you will
          only be required to pay arbitration fees of $250 in connection with any arbitration
          under this section, and the Released Parties will bear all other costs charged by
          AAA or the arbitrator up to $5,000. You will still be responsible for paying your
          own attorneys' fees. Each party shall bear its own costs in the arbitration
          proceeding.
        </p>
        <h4><strong>18. ASSIGNMENT</strong></h4>
        <p>
          We reserve the right, in our sole discretion and without your consent, to transfer,
          assign, sublicense or pledge the TP Powered App, the Software and/or the Agreements,
          in whole or in part, to any person or entity without notice. You may not assign,
          sublicense or otherwise transfer in any manner whatsoever any of your rights or
          obligations under the Agreements.
        </p>
        <h4><strong>19. ENTIRE AGREEMENT, MODIFICATION AND AMENDMENTS</strong></h4>
        <p>
          The Agreements represent the complete and final agreement between you and us regarding
          the subject matter hereof and supersede any and all prior agreements between you and
          us relating to the TP Powered App. You understand and agree to be bound by the
          Agreements as they may be amended from time to time. We may amend the Agreements at
          any time, in our sole and complete discretion, by publishing the amended Agreements on
          the TP Powered App or any place through which you access the TP Powered App or the
          Software. Any amendment to the Agreements will take effect on the day of first
          publication on the TP Powered App or any place through which you access the TP Powered
          App or Software. If any amendment is unacceptable to you, your only recourse is to
          terminate use of the TP Powered App. It is your sole responsibility to review the
          Agreements and any amendments each time you use the TP Powered App.
        </p>
        <h4><strong>20. SEVERABILITY</strong></h4>
        <p>
          In the event any provision of these Terms is held unenforceable (except as stated in
          the Class Waiver section above), such provision will be ineffective but shall not
          affect the enforceability of the remaining provisions. To the fullest extent allowable
          by law and equity, the parties agree that any such provision may be blue-penciled or
          otherwise revised by the forum presiding over any dispute to give effect to the intent
          of the parties and consistent with the overall purpose and intent of the agreement,
          and may be replaced by an enforceable provision that comes closest to the intention
          underlying the unenforceable provision.
        </p>
        <h4><strong>21. FORCE MAJEURE</strong></h4>
        <p>
          The failure of CARNIVAL to comply with any provision of these Terms due to
          circumstances beyond their control including but not limited to an act of God,
          hurricane, war, fire, riot, earthquake, weather, pandemic or endemic, terrorism, act
          of public enemies, strikes, labor shortage, actions of governmental authorities or
          other force majeure event will not be considered a breach of these Terms, and
          CARNIVAL'S performance obligations, if any, shall be delayed until such time as
          performance becomes reasonably practicable and if performance is no longer possible.
        </p>
        <h4><strong>22. Bad Debt</strong></h4>
        <p>
          CARNIVAL reserves the right to recover bad debts using any method lawfully available
          including, but not limited to, (i) debiting the amount owed by you from your Account;
          and (ii) instructing third party collections agencies to collect the debt.
        </p>
        <h4><strong>23. GOVERNING LAW AND JURISDICTION</strong></h4>
        <p>
          To the extent permitted by law, these Terms will be governed by and interpreted in
          accordance with, the laws of the State of Florida without regard for its choice of
          conflict of law principles. Please note that this means that Florida law shall apply
          to these terms and all Services.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
