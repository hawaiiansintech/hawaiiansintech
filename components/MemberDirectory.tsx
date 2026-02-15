import { MemberPublic } from "@/lib/firebase-helpers/interfaces";
import { cn } from "@/lib/utils";
import { useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import LoadingSpinner, { LoadingSpinnerVariant } from "./LoadingSpinner";

export interface DirectoryMember extends MemberPublic {
  focus: { active?: boolean; id: string; name: string }[];
  industry: { active?: boolean; id: string; name: string }[];
  experienceFilter: { active?: boolean; id: string; name: string }[];
  regionFilter: { active?: boolean; id: string; name: string }[];
}

interface MemberDirectoryProps {
  members?: DirectoryMember[];
  loadMoreMembers?: () => void;
  isLoadingMoreMembers?: boolean;
  isLoadingFilteredMembers?: boolean;
}

export default function MemberDirectory({
  members,
  loadMoreMembers,
  isLoadingMoreMembers,
  isLoadingFilteredMembers,
}: MemberDirectoryProps) {
  const handleScroll = useCallback(
    debounce(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const rowHeight = 140;
      const nearBottom =
        scrollPosition + windowHeight >= documentHeight - rowHeight;

      if (nearBottom && !isLoadingMoreMembers) {
        loadMoreMembers();
      }
    }, 100),
    [isLoadingMoreMembers, loadMoreMembers],
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const isFiltered =
    members.filter(
      (mem) =>
        mem.focus
          .concat(mem.industry)
          .concat(mem.experienceFilter)
          .concat(mem.regionFilter)
          ?.filter((foc) => foc.active).length > 0,
    ).length > 0;
  return (
    <section
      className={cn(
        `
        relative
        mt-8
        grid
        grid-flow-row
        grid-cols-1
        gap-4
        px-4
        pb-16
        transition-opacity
        sm:auto-rows-fr
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
      `,
        isLoadingFilteredMembers && "opacity-50",
      )}
    >
      {members.map((member) => {
        const isSelected =
          member.focus
            .concat(member.industry)
            .concat(member.experienceFilter)
            .concat(member.regionFilter)
            ?.filter((foc) => foc.active).length > 0;
        return (
          <a
            className={cn(
              `
              flex
              min-h-[140px]
              flex-col
              rounded-2xl
              border-4
              border-transparent
              bg-tan-300/50
              px-2
              py-1
              transition-all
              hover:border-tan-400
              hover:bg-tan-300
              hover:no-underline
              sm:px-4
              sm:py-2
            `,
              isSelected
                ? "border-brown-600/50 bg-brown-600/10 hover:border-brown-600/30 hover:bg-brown-600/30"
                : isFiltered
                  ? "opacity-50 hover:opacity-100"
                  : "",
            )}
            key={`member-${member.id}`}
            href={member.link}
            target="_blank"
          >
            <h2
              className={cn(
                `
                text-2xl
                font-medium
                tracking-tight
                text-stone-800
              `,
                isSelected && "text-stone-900",
              )}
            >
              {member.name}
            </h2>
            <div className="flex grow flex-col gap-2">
              {member.title ? (
                <h3
                  className={cn(
                    `
                  text-lg
                  font-medium
                  leading-tight
                  text-brown-600
                `,
                    isSelected && "text-stone-700",
                  )}
                >
                  {member.title}
                </h3>
              ) : (
                <></>
              )}
              <div className="flex flex-col gap-1">
                {member.focus.length > 0 && (
                  <section className="border-b border-tan-400/50 pb-2">
                    <h5 className="text-sm font-medium text-stone-600">
                      Focus{member.focus.length >= 2 && "es"}
                    </h5>
                    {member.focus?.map((fil, index) => (
                      <h4
                        className={cn(
                          `
                            inline
                            text-base
                            font-semibold
                            leading-snug
                            text-stone-900
                          `,
                          fil.active && "text-brown-600",
                        )}
                        key={`member-meta-${fil.id}`}
                      >
                        {fil.name}
                        {index !== member.focus.length - 1 && ", "}
                      </h4>
                    ))}
                  </section>
                )}
                {member.industry.length > 0 && (
                  <section className="border-b border-tan-400/50 pb-2">
                    <h5 className="text-sm font-medium text-stone-600">
                      Industr{member.industry.length >= 2 ? "ies" : "y"}
                    </h5>
                    <h4 className="leading-snug">
                      {member.industry?.map((fil, index) => (
                        <span
                          className={cn(
                            `
                            text-base
                            font-semibold
                            text-stone-900
                          `,
                            fil.active && "text-brown-600",
                          )}
                          key={`member-meta-${fil.id}`}
                        >
                          {fil.name}
                          {index !== member.industry.length - 1 && ", "}
                        </span>
                      ))}
                    </h4>
                  </section>
                )}
                {member.experienceFilter.length > 0 && (
                  <section className="border-b border-tan-400/50 pb-2">
                    <h5
                      className={cn(
                        `
                          text-sm
                          font-medium
                          text-stone-600
                        `,
                      )}
                    >
                      Years of Experience
                    </h5>
                    <h4 className="leading-snug">
                      {member.experienceFilter?.map((fil) => (
                        <span
                          className={cn(
                            `
                            text-base
                            font-semibold
                            leading-snug
                            text-stone-900
                            `,
                            member.experienceFilter[0]?.active &&
                              "text-brown-600",
                          )}
                          key={`member-meta-${fil.id}`}
                        >
                          {fil.name}
                        </span>
                      ))}
                    </h4>
                  </section>
                )}

                <section>
                  <h5
                    className={cn(
                      `
                      text-sm
                      font-medium
                      text-stone-600
                    `,
                    )}
                  >
                    Location
                  </h5>
                  <h4
                    className={cn(
                      `
                    text-base
                    font-semibold
                    leading-snug
                    text-stone-900
                  `,
                      member.regionFilter[0]?.active && "text-brown-600",
                    )}
                  >
                    {member.location ? member.location + ", " : ""}
                    {member.regionFilter[0] ? (
                      <span>{member.regionFilter[0].name}</span>
                    ) : (
                      <span>{member.region}</span>
                    )}
                  </h4>
                </section>
              </div>
            </div>
          </a>
        );
      })}
      <div
        className={cn(
          "absolute inset-x-0 bottom-4 flex translate-y-4 items-center justify-center opacity-0 transition-all duration-100",
          isLoadingMoreMembers && "translate-y-0 opacity-100",
        )}
      >
        <LoadingSpinner variant={LoadingSpinnerVariant.Invert} />
      </div>
    </section>
  );
}
