package com.mpl.auctionbackend.auctionbackend.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerDetails {

    private Long id;
    private String name;
    private String role;
    private Integer basePoint;
    private String image;
    private String playerId;
}
