import Link from "next/link";
import theme from "styles/theme";

export default function Nav() {
  return (
    <ul className="auxNav">
      <li>
        <Link href="/about">
          <a>About</a>
        </Link>
      </li>

      <li>
        <Link href="/join">
          <a>Join</a>
        </Link>
      </li>

      <style jsx>{`
        ul {
          padding: 0;
          margin: 0;
          display: flex;
        }

        ul li {
          list-style: none;
          margin-right: 2.2rem;
        }

        ul li a {
          color: ${theme.color.text.base};
          text-decoration: none;
          transition: color 150ms ease;
        }

        ul li a:hover {
          color: ${theme.color.link.base};
        }
      `}</style>
    </ul>
  );
}
