import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

type AccessibilityPolicyProps = {};

const AccessibilityPolicy: React.FC<AccessibilityPolicyProps> = () => {
  return (
    <div className='scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-200 mt-2 flex h-96 w-full flex-col overflow-auto rounded-lg bg-white px-4 py-2'>
      <div className='relative z-0 flex flex-col justify-between gap-4 px-4 pt-4'>
        <h3 className='text-lg font-bold'>Introduction: TimePlay Digital Accessibility Policy Mission Statement</h3>
        <p>
          The TimePlay Digital Accessibility Policy (“Policy”) has been established to define the accessibility standards and requirements for all iLottery Products within TimePlay (“Us”, “Our”, “We”). 

          Given the importance of digital accessibility through the use of websites and other platforms, this policy seeks to ensure all TimePlay digital properties are accessible to all, including members of the disability community.
          Ensuring accessibility digital properties is in line with TimePlay's Core Values found at <a href='https://www.timeplay.com/about-us' className='text-blue-800 underline' target='_blank'>timeplay.com/about-us</a>.
        </p>
        <h3 className='mt-2 text-lg font-bold'>Applicable Digital Properties</h3>
        <p className='leading-normal'>
          This Policy applies to our customer-facing mobile apps, and the content that appears on them that are operated or controlled by Us that are intended to be used by customers, business partners, and other external stakeholders (for example, job applicants, media personnel, etc.). Current digital properties should meet at least the minimum requirements of this Policy. Newly developed digital properties should meet or exceed the minimum requirements since the expectation is that they would be built accessible from the ground up.
        </p>
        <h3 className='mt-2 text-lg font-bold'>Employee-Facing Digital Properties</h3>
        <p className='leading-normal'>
          Currently, this policy does not formally extend to employee-facing properties. However, all possible efforts should be made to ensure that employees have an accessible and inclusive experience when working with any platform that is required for their role.
        </p>
        <h3 className='mt-2 text-lg font-bold'>Requirements for TimePlay Digital Properties</h3>
        <h4 className='mt-2 text-lg font-bold'>WCAG Conformance</h4>
        <p className='leading-normal'>
          As of October 2023, the Web Content Accessibility Guidelines (WCAG) current version is 2.2 and TimePlay strives to conform to Level AA. TimePlay audited against the WCAG 2.2 AA success criteria.
        </p>
        <h4 className='mt-2 text-lg font-bold'>Implementation Guidelines</h4>
        <p className='leading-normal'>
          While TimePlay strives to be fully conformant with the WCAG, TimePlay considers a baseline of accessibility to be the following:<br/>
        </p>
        <p><b>•</b>	The digital property has no high severity issues identified in any audit or testing that is performed. A high severity issue is defined as something that blocks a user is part of the disabled community from interacting with / completing tasks on the digital property. </p>
        <p><b>•</b>	The digital property has no issues that can be determined by an automated scan.</p>
        <p><b>•</b>	Considering the nature of some of the experiences TimePlay creates (such as high visual experience games), some of the WCAG 2.2 AA success criteria might not be fully applicable.</p>
        <p className='leading-normal'>
          With the desire to be fully WCAG conformant, TimePlay operates under the premise that:
        </p>
        <p><b>•</b>	All UI/UX/Design work performed for digital properties conforms to the WCAG.</p>
        <p><b>•</b>	All development work on digital properties conforms to the WCAG.</p>
        <p><b>•</b>	All content created for the digital properties conforms to the WCAG.</p>
        <p><b>•</b>	All QA activities on the digital properties include test cases to test for WCAG conformance, including using screen readers and keyboard navigation.</p>
        <p className='leading-normal'>
          In instances where the baseline of accessibility cannot be met, the product owners/stakeholders must be informed so they can determine revised timelines for conformance and to notify customers if needed.
        </p>
        <h4 className='mt-2 text-lg font-bold'>Roles and Responsibilities</h4>
        <p className='leading-normal'>
          Everyone who is involved with TimePlay's digital properties plays a role in the accessibility.  Some of these roles have similar responsibilities, and each are spelled out here to ensure clarity.
        </p>
        <p><b>•</b>	Product owners/stakeholders: Ensure that this policy is upheld for the products they manage. They also work to make sure all requirements from customers are known and are met.</p>
        <p><b>•</b>	Project managers: Ensure that accessibility requirements are met in every project. If for any reason the requirements cannot be met, they notify appropriate stakeholders, and determine a plan to bring the project back into alignment with this policy. Accessibility is part of the overall definition of done for any project.</p>
        <p><b>•</b>	Design team: All UI/UX/design work must conform with WCAG guidelines, or at minimum meet the baseline level for accessibility. Accessibility is considered part of this team's definition of done for any project.</p>
        <p><b>•</b>	Development team: All code must conform with WCAG guidelines, or at minimum meet the baseline level for accessibility. Accessibility is considered part of this team's definition of done for any project.</p>
        <p><b>•</b>	Content team (including teams that produce text, audio, video, and any other multimedia): All content created and entered by this team must conform with WCAG guidelines, or at minimum meet the baseline level for accessibility. Accessibility is considered part of this team's definition of done for any project.</p>
        <p><b>•</b>	Quality Assurance (QA) team: All digital properties tested by this team must include uses cases that include screen reader technology and keyboard navigation testing, along with other testing that verifies the WCAG guidelines.</p>
        <p><b>•</b>	Legal/compliance team: Ensures that this policy includes all legal and compliance expectations regarding accessibility so that all teams are notified accordingly of requirements.</p>
        <p>
          NOTE: It's understood that as this policy is drafted that not all roles may be able to undertake these requirements. In case they can't, a timeline will be developed with them so that it's known when they will be able to fully follow this policy.
        </p>
        <h4 className='mt-2 text-lg font-bold'>Process Expectations</h4>
        <p className='leading-normal'>
          With the Roles and Responsibilities including accessibility as part of the definition of done for the individual, that also evolves the process for new projects, as well as for any maintenance work.
        </p>
        <h4 className='mt-2 text-lg font-bold'>Training</h4>
        <p className='leading-normal'>
          Continuing education on digital accessibility is key for a sustainable accessibility program so that teams are able to have accessibility top of mind. Education also ensures that teams are up to date on the latest available information.
        </p>
        <h4 className='mt-2 text-lg font-bold'>Timelines</h4>
        <p className='leading-normal'>
          This document was drafted in June 2024.

          Overall, the enforcement of this policy begins on November 15th, 2024.

          Due to the complexities of introducing new policy, the following areas have timelines that differ from the main enforcement date:
        </p>
        <Table isStriped>
          <TableHeader>
            <TableColumn className="uppercase">Date</TableColumn>
            <TableColumn className="uppercase">Item</TableColumn>
            <TableColumn className="uppercase">Notes</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Q1 2025</TableCell>
              <TableCell>All UI/UX/Design conforms to the WCAG</TableCell>
              <TableCell children={undefined}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Q2 2025</TableCell>
              <TableCell>All development conforms to the WCAG</TableCell>
              <TableCell children={undefined}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Q4 2024</TableCell>
              <TableCell>All content created conforms to the WCAG</TableCell>
              <TableCell children={undefined}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Q1 2025</TableCell>
              <TableCell>All QA activities include test cases to test for WCAG conformance, including using screen readers and keyboard navigation</TableCell>
              <TableCell children={undefined}></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <span>Role Related Changes</span>
        <Table isStriped>
          <TableHeader>
            <TableColumn className="uppercase">Date</TableColumn>
            <TableColumn className="uppercase">Role</TableColumn>
            <TableColumn className="uppercase">Function</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Q1 2025</TableCell>
              <TableCell>Product owners/stakeholders</TableCell>
              <TableCell>Ensure that this policy is upheld for the products they manage. Make sure all requirements from customers are known and are met.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Q2 2025</TableCell>
              <TableCell>Project managers</TableCell>
              <TableCell>Ensure that accessibility requirements are met in every project. If for any reason the requirements cannot be met, they notify appropriate stakeholders, and determine a plan to bring the project back into alignment with this policy. Accessibility is part of the overall definition of done for any project.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Q4 2024</TableCell>
              <TableCell>Design team</TableCell>
              <TableCell>Acquire appropriate competences</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Q4 2024</TableCell>
              <TableCell>Development team</TableCell>
              <TableCell>Acquire appropriate competences</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Q4 2024</TableCell>
              <TableCell>Content team</TableCell>
              <TableCell>Acquire appropriate competences</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Q4 2024</TableCell>
              <TableCell>Quality Assurance (QA) team</TableCell>
              <TableCell>Acquire appropriate competences</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Q1 2025</TableCell>
              <TableCell>Legal/compliance team</TableCell>
              <TableCell>Ensures that this policy includes all legal and compliance expectations regarding accessibility so that all teams are notified accordingly of requirements.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h3 className='mt-2 text-lg font-bold'>Contact Information</h3>
        <p className='leading-normal'>
          If you have feedback about your accessible customer service experience, please let us know by contacting Support Centre at <a href='mailto:accessibility@timeplay.com' className='text-blue-800 underline'>accessibility@timeplay.com</a>.
        </p>
      </div>
    </div>
  );
};

export default AccessibilityPolicy;
