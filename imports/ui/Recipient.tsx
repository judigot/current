import React from "react";

const Recipient = ({
  recipientType,
  label,
  inputRef,
  filteredUsers,
  selectedUsers,
  allUsers,
  onChange,
  onSelectUser,
  handleRemoveUser,
  handleAddEmail,
  actions,
}: Recipient) => {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  // If input field is empty, display all users instead
  const usersSource = inputRef.current?.value ? filteredUsers : allUsers;

  let color: string, bgColor: string;

  switch (recipientType) {
    case "to":
      {
        color = "text-white";
        bgColor = "bg-indigo-600";
      }
      break;

    case "cc":
      {
        color = "text-black";
        bgColor = "bg-[#9EA635]";
      }
      break;

    case "bcc":
      {
        color = "text-black";
        bgColor = "bg-[#E8F25A]";
      }
      break;
  }

  console.log(
    `${color!} ${bgColor!} font-semibold inline-block m-1 p-1 rounded-full text-sm`
  );

  return (
    <div
      className="border-b"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(200px, 1fr) max-content",
        position: "relative",
      }}
    >
      <div>
        <span>{label}</span>
        <span>
          {selectedUsers &&
            selectedUsers.map((email, i, array) => {
              return (
                <div
                  key={i}
                  className={`${color!} ${bgColor!} font-semibold inline-block m-1 p-1 rounded-full text-sm`}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, max-content)",
                    }}
                  >
                    <div>
                      {(() => {
                        // Regular for loop to breaking the loop when a match is found
                        for (
                          let i = 0, arrayLength = allUsers.length;
                          i < arrayLength;
                          i++
                        ) {
                          const user = allUsers[i];
                          if (email === user.email) {
                            return `${user.name}, `;
                          }
                        }
                      })()}
                      <span className="underline">{email}</span>
                    </div>
                    <div className="cursor-pointer">
                      {/* prettier-ignore */}
                      <svg
                      onClick={() => {
                        handleRemoveUser(recipientType, email);
                      }
                      } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" > <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          {false &&
            allUsers &&
            allUsers.map((row, i, array) => {
              if (selectedUsers.includes(row.email)) {
                return (
                  <div
                    key={row.id}
                    className="font-semibold inline-block m-1 p-1 rounded-full text-sm bg-indigo-600 text-white"
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, max-content)",
                      }}
                    >
                      <div>
                        {row.name}, {row.email}
                      </div>
                      <div className="cursor-pointer">
                        {/* prettier-ignore */}
                        <svg
                        onClick={() => {
                          handleRemoveUser(recipientType, row.id);
                        }
                        } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" > <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
        </span>

        <div className="inline-block">
          <input
            ref={inputRef}
            onChange={() => {
              onChange(recipientType, inputRef);
            }}
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            // onFocus={onFocus}
            // onBlur={onBlur}
            type="email"
            name={recipientType}
            id={recipientType}
            // style={{ width: "100%" }}
            className="border-transparent focus:border-transparent focus:ring-0 py-1.5 text-gray-900  ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
          />
        </div>

        {(() => {
          const isValidEmail = (email: string) => {
            return String(email)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              );
          };

          const email: string = inputRef.current?.value;

          if (isValidEmail(email)) {
            const isEmailAlreadyAdded = selectedUsers.includes(email);
            return (
              isFocused &&
              usersSource?.length == 0 && (
                <ul
                  className={`${
                    !isEmailAlreadyAdded
                      ? "cursor-pointer bg-slate-800"
                      : "bg-slate-500"
                  } z-10 absolute w-full text-white rounded-md p-3 h-min max-h-80 overflow-y-scroll w-80`}
                >
                  <li
                    className={`p-1${
                      isEmailAlreadyAdded ? " pointer-events-none" : ""
                    }`}
                    onMouseDown={() => {
                      handleAddEmail(inputRef, recipientType);
                    }}
                  >
                    <div>
                      <span className="font-semibold">
                        {inputRef.current?.value}
                      </span>
                      {isEmailAlreadyAdded && <i> is already added</i>}
                    </div>
                  </li>
                </ul>
              )
            );
          }
        })()}

        {isFocused &&
          usersSource?.length !== 0 &&
          // Hides dropdown when all users are selected
          usersSource?.length !== selectedUsers.length && (
            <ul className="z-10 absolute w-full cursor-pointer bg-slate-800 text-white rounded-md p-3 h-min max-h-80 overflow-y-scroll w-80">
              {usersSource?.map((row: User, i: number, array: User[]) => {
                if (!selectedUsers.includes(row.email)) {
                  return (
                    <li
                      key={row.id}
                      className="p-1"
                      onMouseDown={() => {
                        onSelectUser(
                          recipientType,
                          row.id,
                          row.email,
                          inputRef
                        );
                        setTimeout(() => {
                          inputRef.current?.focus();
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

      <div className="inline-block" style={{ margin: "auto 0% auto 0%" }}>
        {actions()}
      </div>
    </div>
  );
};
export default Recipient;
