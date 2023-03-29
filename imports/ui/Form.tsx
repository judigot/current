import React from "react";

import Users, { User } from "../getUsers";

interface UserRanks {
  rank: number;
  user: User;
}

export const Form = () => {
  const [users, setUsers] = React.useState<User[]>();
  const [filteredUsers, setFilteredUsers] = React.useState<UserRanks>();
  const toInput = React.useRef<string>("");

  React.useEffect(() => {
    // Initial render
    (async () => {
      const data: User[] | undefined = await Users();
      if (data) {
        setUsers(data);
      }
    })();
  }, []);

  const isRankingEnabled = !true;

  const sortByRank = (userRanks: UserRanks[]) => {
    const sortByRank = {
      key: "rank",
      orderBy: "desc",
    };
    userRanks.sort((a: any, b: any) => {
      return (
        (sortByRank.orderBy === "asc" ? 1 : -1) * // Negate result for descending
        (a[sortByRank.key] - b[sortByRank.key])
      );
    });
    return userRanks;
  };

  return (
    <form onSubmit={() => {}}>
      <div className="mb-4">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          ref={toInput}
          onChange={(e) => {
            // Destructure useRef
            let {
              current: { value: needle },
            } = toInput;
            if (needle) {
              // Filter username & email

              const passed: {
                [key: number]: UserRanks;
              } = {};
              users.map((row: User, i: number, array: User[]) => {
                // Filter username & email

                // Values to be matched
                const haystack = [row.name, row.email];

                // Convert to uppercase to match accurately
                let rowContents = haystack.join(" ").toUpperCase();

                const haystackValues = rowContents.split(" ");

                needle = needle.replace(/\s+/g, "").toUpperCase();

                haystackValues.map((value) => {
                  if (value.includes(needle)) {
                    if (isRankingEnabled) {
                      // With ranking
                      if (!passed[row.id]) {
                        passed[row.id] = {
                          rank: 1,
                          user: users[i],
                        };
                      } else {
                        passed[row.id].rank++;
                      }
                    } else {
                      // Without ranking
                      passed[row.id] = users[i];
                    }
                  }
                });
              });
              if (isRankingEnabled) {
                setFilteredUsers(sortByRank(Object.values(passed)) || []);
              } else {
                setFilteredUsers(Object.values(passed) || []);
              }
            } else {
              setFilteredUsers([]);
            }
          }}
          type="email"
          name="email"
          id="email"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
        />
      </div>

      {!isRankingEnabled &&
        filteredUsers?.map((row: User, i: number, array: User[]) => {
          return (
            <p key={i}>
              {row.name} {row.email}
            </p>
          );
        })}

      {isRankingEnabled &&
        filteredUsers?.map((row: UserRanks, i: number, array: User[]) => {
          return (
            <p key={i}>
              {row.user.name} {row.user.email}
            </p>
          );
        })}

      <div className="mb-4">
        <label htmlFor="body" className="sr-only">
          Body
        </label>
        <textarea
          rows={4}
          name="body"
          id="body"
          className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
          defaultValue={""}
          placeholder="Type your message here…"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Send
      </button>
    </form>
  );
};
