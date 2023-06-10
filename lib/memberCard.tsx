import { StatusEnum } from "@/lib/enums";
export default function MemberCard(member) {
  console.log("member:", member);
  let backgroundColor = "#f2f2f2";
  switch (member.status) {
    case StatusEnum.APPROVED:
      backgroundColor = "#d4edda";
      break;
    case StatusEnum.PENDING:
      backgroundColor = "#fff3cd";
      break;
    case StatusEnum.IN_PROGRESS:
      backgroundColor = "#cce5ff";
      break;
    case StatusEnum.DECLINED:
      backgroundColor = "#f8d7da";
      break;
    default:
      break;
  }
  return (
    <div className="member-container" key={member.id}>
      <div className="member-header">
        <h2>
          {member.name}, {member.title}
        </h2>
      </div>
      <div className="member-body">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Title</th>
              <th>Status</th>
              <th>Last Modified</th>
              <th>Location</th>
              <th>Company Size</th>
              <th>Region</th>
              <th>Focuses</th>
              <th>Industries</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.title}</td>
              <td>{member.status}</td>
              <td>{member.lastModified}</td>
              <td>{member.location}</td>
              <td>{member.companySize}</td>
              <td>{member.region}</td>
              <td>
                {member.focus &&
                  member.focus.map((focus) => (
                    <div key={member.id + focus.id}>
                      {focus.name} - {focus.status}
                    </div>
                  ))}
              </td>
              <td>
                {member.industry &&
                  member.industry.map((industry) => (
                    <div key={member.id + industry.id}>
                      {industry.name} - {industry.status}
                    </div>
                  ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <style jsx>{`
        h2 {
          font-size: 1.5rem;
        }
        .member-container {
          background-color: ${backgroundColor};
          border-radius: 0.25rem;
          box-shadow: 0 0 0.1rem rgba(0, 0, 0, 0.2);
          margin: 1rem;
          padding: 1rem;
        }
        .member-header {
          margin-bottom: 1rem;
        }
        .member-header h1 h2 h3 h4 {
          margin-bottom: 0.5rem;
          text-align: left;
        }
        .member-body {
          font-size: 1rem;
          display: flex;
          justify-content: space-between;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          padding: 0.5rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
        }
        .member-details {
          width: 50%;
        }
        .member-body h4 {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .member-body ul {
          margin-top: 0.5rem;
          margin-bottom: 1rem;
          margin-left: 1rem;
        }
        .member-body li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
