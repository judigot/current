import React from "react";

import Users, { User } from "../getUsers";

interface UserRanks {
  rank: number;
  user: User;
}

interface Recipient {
  id: string;
  label: string;
  inputRef: React.useRef;
  filteredUsers: User[] | null;
  selectedUsers: number[];
  allUsers: User[];
  onChange: Function;
  onSelectUser: Function;
  actions: React.JSX;
}

enum RecipientTypes {
  to = "to",
  cc = "cc",
  bcc = "bcc",
}

const Recipient = ({
  id,
  label,
  inputRef,
  filteredUsers,
  selectedUsers,
  allUsers,
  onChange,
  onSelectUser,
  actions,
}: Recipient) => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  return (
    <div
      className="border-b"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(200px, 1fr) max-content",
      }}
    >
      <div className="my-auto">
        <span>{label}</span>
        <span>
          {allUsers &&
            allUsers.length !== 0 &&
            allUsers.map((row, i, array) => {
              if (selectedUsers.includes(row.id)) {
                return (
                  <span
                    key={row.id}
                    className="m-1 p-1 rounded-md bg-gray-200 cursor-pointer"
                    onClick={() => {
                      alert(row.id);
                    }}
                  >
                    {row.name}
                  </span>
                );
              }
            })}
        </span>
        <span>
          <div className="inline-block">
            <input
              ref={inputRef}
              onChange={onChange}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              // onFocus={onFocus}
              // onBlur={onBlur}
              type="email"
              name={id}
              id={id}
              style={{ width: "100%" }}
              className="border-transparent focus:border-transparent focus:ring-0 py-1.5 text-gray-900  ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            />
            {isFocused && filteredUsers && filteredUsers.length !== 0 && (
              <ul
                className="cursor-pointer bg-slate-800 text-white rounded-md p-3 h-min max-h-80 overflow-y-scroll w-80"
                style={{ position: "absolute" }}
              >
                {filteredUsers.map((row: User, i: number, array: User[]) => {
                  if (!selectedUsers.includes(row.id)) {
                    return (
                      <li
                        key={row.id}
                        className="p-1"
                        onMouseDown={() => {
                          onSelectUser(id, row.id, inputRef);
                          setTimeout(() => {
                            inputRef.current.focus();
                          });
                        }}
                      >
                        <div className="font-semibold">{row.name}</div>
                        <div>{row.email}</div>
                      </li>
                    );
                  }
                })}
              </ul>
            )}
          </div>
        </span>
      </div>

      <div className="inline-block" style={{ margin: "auto 0% auto 0%" }}>
        {actions()}
      </div>
    </div>
  );
};

export const Form = () => {
  const [users, setUsers] = React.useState<User[]>();

  const [recipients, setRecipients] = React.useState<number[]>([]);
  const [ccRecipients, setcccRecipients] = React.useState<User[]>([]);
  const [bccRecipients, setBccRecipients] = React.useState<User[]>([]);

  const [filteredUsers, setFilteredUsers] = React.useState<User>(null);
  const [filteredCcUsers, setFilteredCcUsers] = React.useState<User>(null);
  const [filteredBccUsers, setFilteredBccUsers] = React.useState<User>(null);

  const recipientRef = React.useRef<string>("");
  const ccRef = React.useRef<string>("");
  const bccRef = React.useRef<string>("");

  const [isCcVisible, setIsCcVisible] = React.useState<boolean>(false);
  const [isBccVisible, setIsBccVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Initial render
    (async () => {
      const data: User[] | undefined = await Users();
      if (data) {
        setUsers(data);
      }
    })();
  }, []);

  const isRankingEnabled = true;

  const sortByRank = (userRanks: UserRanks[]) => {
    const sortByRank = {
      key: "rank",
      orderBy: "desc",
    };
    userRanks.sort((a: UserRanks, b: UserRanks) => {
      return (
        (sortByRank.orderBy === "asc" ? 1 : -1) * // Negate result for descending
        (a[sortByRank.key] - b[sortByRank.key])
      );
    });
    return userRanks;
  };

  const handleToInput = () => {
    // Destructure useRef
    let {
      current: { value: needle },
    } = recipientRef;
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
      const ranked = sortByRank(Object.values(passed));
      const finalUsers = ranked.map(
        ({ rank, ...retainedAttributes }) => retainedAttributes.user
      );
      if (isRankingEnabled) {
        setFilteredUsers(finalUsers || null);
      } else {
        setFilteredUsers(finalUsers || null);
      }
    } else {
      setFilteredUsers(users);
    }
  };

  const handleCcInput = () => {
    alert("Cc");
  };

  const handleBccInput = () => {
    alert("Bcc");
  };

  const handleSelectUser = (
    recipientType: RecipientTypes,
    userID: number,
    inputRef: React.useRef
  ) => {
    switch (recipientType) {
      case "to":
        // Remove selected user from recipients
        const tempUsersHolder = structuredClone(users);
        tempUsersHolder.map((value: User, i, array) => {
          if (value.id === userID) {
            tempUsersHolder.splice(i, 1);
          }
        });
        inputRef.current.value = "";
        setFilteredUsers(tempUsersHolder);

        const tempRecipientsHolder = structuredClone(recipients);
        tempRecipientsHolder.push(userID);
        setRecipients(tempRecipientsHolder);
        break;
      case "cc":
        break;
      case "bcc":
        break;
      default:
        break;
    }
  };

  return (
    <form onSubmit={() => {}}>
      <div className="mb-4 w-full">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <Recipient
          id={"to"}
          label={"To"}
          inputRef={recipientRef}
          filteredUsers={filteredUsers}
          selectedUsers={recipients}
          allUsers={users}
          onChange={handleToInput}
          onSelectUser={handleSelectUser}
          actions={() => {
            return (
              <span>
                {!isCcVisible && (
                  <span
                    className="hover:underline cursor-pointer"
                    onClick={() => {
                      setIsCcVisible(!isCcVisible);
                    }}
                  >
                    Cc
                  </span>
                )}
                {!isCcVisible && !isBccVisible && " / "}
                {!isBccVisible && (
                  <span
                    className="hover:underline cursor-pointer"
                    onClick={() => {
                      setIsBccVisible(!isBccVisible);
                    }}
                  >
                    Bcc
                  </span>
                )}
              </span>
            );
          }}
        />

        {isCcVisible && (
          <Recipient
            id={"cc"}
            label={"Cc"}
            inputRef={ccRef}
            filteredUsers={recipients}
            selectedUsers={ccRecipients}
            allUsers={users}
            onChange={handleCcInput}
            onSelectUser={handleSelectUser}
            actions={() => {
              return (
                <span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setIsCcVisible(!isCcVisible);
                    }}
                  >
                    {/* prettier-ignore */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" > <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg>
                  </span>
                </span>
              );
            }}
          />
        )}

        {isBccVisible && (
          <Recipient
            id={"bcc"}
            label={"Bcc"}
            inputRef={bccRef}
            filteredUsers={recipients}
            selectedUsers={bccRecipients}
            allUsers={users}
            onChange={handleBccInput}
            onSelectUser={handleSelectUser}
            actions={() => {
              return (
                <span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setIsBccVisible(!isBccVisible);
                    }}
                  >
                    {/* prettier-ignore */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" > <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg>
                  </span>
                </span>
              );
            }}
          />
        )}
      </div>

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
