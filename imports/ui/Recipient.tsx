import React from "react";

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

  // If input field is empty, display all users instead
  const usersSource = inputRef.current?.value ? filteredUsers : allUsers;

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
          {allUsers &&
            allUsers.map((row, i, array) => {
              if (selectedUsers.includes(row.id)) {
                return (
                  <div
                    key={row.id}
                    className="inline-block m-1 p-1 rounded-md bg-gray-200 cursor-pointer"
                    onClick={() => {
                      alert(row.id);
                    }}
                  >
                    {row.email}
                  </div>
                );
              }
            })}
        </span>

        <div className="inline-block">
          <input
            ref={inputRef}
            onChange={() => {
              onChange(id, inputRef);
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
            name={id}
            id={id}
            // style={{ width: "100%" }}
            className="border-transparent focus:border-transparent focus:ring-0 py-1.5 text-gray-900  ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
          />
        </div>
        {isFocused &&
          usersSource?.length !== 0 &&
          // Hides dropdown when all users are selected
          usersSource?.length !== selectedUsers.length && (
            <ul className="z-10 absolute w-full cursor-pointer bg-slate-800 text-white rounded-md p-3 h-min max-h-80 overflow-y-scroll w-80">
              {usersSource?.map((row: User, i: number, array: User[]) => {
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

      <div className="inline-block" style={{ margin: "auto 0% auto 0%" }}>
        {actions()}
      </div>
    </div>
  );
};
export default Recipient;
