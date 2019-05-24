import React from "react";

export const Ablank: React.FC<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>> =
  ({target, rel, children, ...otherProps}) => <a target='_blank'
                                                 rel='noopener noreferrer' {...otherProps}>{children}</a>;
