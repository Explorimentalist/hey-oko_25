"use client";

import { CVList } from './CVList';

export function CVListDemo() {
  // Test with 2 columns
  const twoColumnData = [
    ['Senior UI/UX Designer', '2022 - Present'],
    ['Product Designer', '2020 - 2022'],
    ['Junior Designer', '2018 - 2020']
  ];

  // Test with 3 columns
  const threeColumnData = [
    ['Hey-Oko Studio', 'Creative Director', '2022 - Present'],
    ['Design Agency', 'Senior Designer', '2020 - 2022'],
    ['Startup Co.', 'UI Designer', '2018 - 2020']
  ];

  // Test with 4 columns
  const fourColumnData = [
    ['Hey-Oko Studio', 'Creative Director', 'London, UK', '2022 - Present'],
    ['Design Agency', 'Senior Designer', 'Madrid, ES', '2020 - 2022'],
    ['Startup Co.', 'UI Designer', 'Remote', '2018 - 2020']
  ];

  // Test with 5 columns
  const fiveColumnData = [
    ['Hey-Oko Studio', 'Creative Director', 'Design Systems', 'London, UK', '2022 - Present'],
    ['Design Agency', 'Senior Designer', 'Product Design', 'Madrid, ES', '2020 - 2022'],
    ['Startup Co.', 'UI Designer', 'Mobile Apps', 'Remote', '2018 - 2020']
  ];

  return (
    <div className="space-y-16 p-8">
      <CVList
        title="Work Experience (2 Columns)"
        columns={['Position', 'Duration']}
        data={twoColumnData}
        className="mb-12"
      />

      <CVList
        title="Work Experience (3 Columns)"
        columns={['Company', 'Position', 'Duration']}
        data={threeColumnData}
        className="mb-12"
      />

      <CVList
        title="Work Experience (4 Columns)"
        columns={['Company', 'Position', 'Location', 'Duration']}
        data={fourColumnData}
        className="mb-12"
      />

      <CVList
        title="Work Experience (5 Columns)"
        columns={['Company', 'Position', 'Focus', 'Location', 'Duration']}
        data={fiveColumnData}
        className="mb-12"
      />
    </div>
  );
}